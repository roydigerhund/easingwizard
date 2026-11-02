#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mcpRoot = join(repoRoot, 'apps/mcp');
const mcpRequire = createRequire(join(mcpRoot, 'package.json'));

async function filesUnder(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await filesUnder(file)));
    else if (entry.isFile()) result.push(file);
  }
  return result;
}

/** Exercise a locally built npm tarball; never downloads or installs packages. */
export async function smokePackedMcp(tarballPath) {
  const tarball = resolve(tarballPath);
  const { Client } = mcpRequire('@modelcontextprotocol/client');
  const { StdioClientTransport } = mcpRequire('@modelcontextprotocol/client/stdio');
  const temporary = await mkdtemp(join(tmpdir(), 'easingwizard-packed-mcp-'));

  try {
    const entries = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' }).trim().split('\n');
    assert(entries.length > 0, 'The package must contain files');
    for (const entry of entries) {
      assert(entry.startsWith('package/') && !entry.split('/').includes('..'), `Unsafe tar entry: ${entry}`);
      assert(!entry.includes('node_modules/'), 'Runtime dependencies must not be copied into the tarball');
    }
    execFileSync('tar', ['-xzf', tarball, '-C', temporary]);
    const unpacked = join(temporary, 'package');
    const manifest = JSON.parse(await readFile(join(unpacked, 'package.json'), 'utf8'));
    const sourceManifest = JSON.parse(await readFile(join(mcpRoot, 'package.json'), 'utf8'));
    assert.equal(manifest.name, sourceManifest.name);
    assert.equal(manifest.version, sourceManifest.version);
    assert.equal(manifest.dependencies['easingwizard-core'], undefined, 'The private core must be bundled');
    assert.equal(manifest.license, 'SEE LICENSE IN LICENSE');
    const license = await readFile(join(unpacked, 'LICENSE'), 'utf8');
    assert(license.trim().length > 100, 'The published package needs a nonempty license');
    assert.equal(license, await readFile(join(repoRoot, 'LICENSE'), 'utf8'));
    for (const kind of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
      for (const [name, version] of Object.entries(manifest[kind] ?? {})) {
        assert(!/^(workspace|link|file):/.test(version), `Unresolved ${kind} entry: ${name}@${version}`);
      }
    }

    // Only installed, reviewed runtime dependencies are available to the artifact.
    // In particular there is no easingwizard-core or original dist directory here.
    for (const name of Object.keys(manifest.dependencies)) {
      const target = join(unpacked, 'node_modules', name);
      await mkdir(dirname(target), { recursive: true });
      await symlink(await realpath(join(mcpRoot, 'node_modules', name)), target, 'dir');
    }
    for (const file of await filesUnder(join(unpacked, 'dist'))) {
      if (!/\.(?:js|d\.ts)$/.test(file)) continue;
      const content = await readFile(file, 'utf8');
      assert(
        !/(?:from\s*|import\s*\(|require\s*\()\s*['"]easingwizard-core(?:['"/])/.test(content),
        `Artifact still imports private workspace code: ${file}`,
      );
      assert(!content.includes(repoRoot), `Artifact contains a local checkout path: ${file}`);
    }
    for (const name of ['./server', './http']) {
      const entry = manifest.exports[name];
      assert(entry?.import && entry?.types, `Missing runtime/type export: ${name}`);
      assert((await readFile(join(unpacked, entry.types), 'utf8')).trim(), `Empty declaration: ${name}`);
    }

    // Import by the public package specifiers from a separate consumer project.
    const consumer = join(temporary, 'consumer');
    await mkdir(join(consumer, 'node_modules/@easingwizard'), { recursive: true });
    await symlink(unpacked, join(consumer, 'node_modules/@easingwizard/mcp-server'), 'dir');
    await writeFile(
      join(consumer, 'probe.mjs'),
      `
      import assert from 'node:assert/strict';
      import { createEasingWizardServer } from '@easingwizard/mcp-server/server';
      import { createEasingWizardMcpHandler } from '@easingwizard/mcp-server/http';
      const server = createEasingWizardServer();
      await server.close();
      const handler = createEasingWizardMcpHandler();
      try {
        const params = {
          name: 'create_bezier_curve',
          arguments: { x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 },
          _meta: {
            'io.modelcontextprotocol/protocolVersion': '2026-07-28',
            'io.modelcontextprotocol/clientInfo': { name: 'packed-consumer', version: '1.0.0' },
            'io.modelcontextprotocol/clientCapabilities': {},
          },
        };
        const response = await handler.fetch(new Request('http://localhost/mcp', {
          method: 'POST',
          headers: {
            'content-type': 'application/json', accept: 'application/json, text/event-stream',
            'MCP-Protocol-Version': '2026-07-28', 'Mcp-Method': 'tools/call',
            'Mcp-Name': 'create_bezier_curve',
          },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params }),
        }));
        assert.equal(response.status, 200);
        const message = await response.json();
        assert.equal(message.error, undefined, JSON.stringify(message));
        assert.notEqual(message.result.isError, true, JSON.stringify(message));
        assert.equal(message.result.structuredContent.output.css, 'cubic-bezier(0.25, 0.1, 0.75, 0.9)');
      } finally { await handler.close(); }
    `,
    );
    execFileSync(process.execPath, [join(consumer, 'probe.mjs')], { cwd: consumer, stdio: 'pipe', timeout: 10_000 });

    for (const era of ['legacy', 'modern']) {
      const client = new Client(
        { name: 'packed-release-test', version: '1.0.0' },
        {
          supportedProtocolVersions: [era === 'modern' ? '2026-07-28' : '2025-06-18'],
          versionNegotiation: { mode: era === 'modern' ? { pin: '2026-07-28' } : 'legacy' },
        },
      );
      try {
        await client.connect(
          new StdioClientTransport({
            command: process.execPath,
            args: [join(unpacked, manifest.bin['easingwizard-mcp'])],
            cwd: consumer,
            stderr: 'pipe',
          }),
        );
        assert.equal(client.getProtocolEra(), era);
        assert.equal(client.getServerVersion().version, manifest.version);
        const { tools } = await client.listTools();
        assert.equal(tools.length, 7);
        const spring = tools.find((tool) => tool.name === 'create_spring_curve');
        assert.equal(spring.inputSchema.properties.mass.type, 'number');
        assert.equal(spring.inputSchema.properties.mass.minimum, 1);
        assert.equal(spring.outputSchema.type, 'object');
        const result = await client.callTool({
          name: 'create_spring_curve',
          arguments: { mass: 2, stiffness: 50, damping: 50, accuracy: 'HIGH' },
        });
        assert.notEqual(result.isError, true, JSON.stringify(result));
        assert.match(result.structuredContent.output.css, /^linear\(/);
        assert.ok(result.structuredContent.output.suggested_duration_ms.min > 0);
      } finally {
        await client.close();
      }
    }
    return { name: manifest.name, version: manifest.version, tools: 7, protocols: ['2025-06-18', '2026-07-28'] };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 3) throw new Error('Usage: node scripts/smoke-packed-mcp.mjs /path/to/local-package.tgz');
  smokePackedMcp(process.argv[2])
    .then((result) => console.log(`Packed MCP smoke passed: ${JSON.stringify(result)}`))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
