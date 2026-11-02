#!/usr/bin/env node

// Claude is the authoring source. Codex receives portable skill frontmatter,
// the same guidance, and the specialist agent as a skill. No runtime dependencies.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const schemaRoot = 'https://agent-plugins.org/schemas/1.0.0';
const claudePath = 'apps/claude-plugin';
const codexPath = 'apps/codex-plugin';
const generatedRoots = ['skills', 'references', 'assets'];
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

async function filesUnder(root, path = '') {
  const absolute = join(root, path);
  const stat = await lstat(absolute);
  assert(!stat.isSymbolicLink(), `Plugin packages must not contain symlinks: ${absolute}`);
  if (stat.isFile()) return [path];
  assert(stat.isDirectory(), `Unsupported package entry: ${absolute}`);
  const files = [];
  for (const name of (await readdir(absolute)).sort()) {
    assert(!/[\\\r\n]/.test(name), `Unsupported package filename: ${name}`);
    files.push(...await filesUnder(root, path ? `${path}/${name}` : name));
  }
  return files;
}

function portableSkill(source, isAgent = false) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert(match, 'Skill/agent must start with YAML frontmatter');
  // Our source files use single-line fields. Host-specific permissions, models,
  // and invocation controls do not travel to a different host.
  const fields = match[1].split('\n').filter((line) => /^(name|description): /.test(line));
  assert.equal(fields.length, 2, 'Expected a name and a description');
  const body = isAgent ? match[2].replace('(../references/', '(../../references/') : match[2];
  return `---\n${fields.join('\n')}\n---\n${body}`;
}

export async function expectedCodexFiles(root = repoRoot) {
  const sourceRoot = join(root, claudePath);
  const manifest = await readJson(join(sourceRoot, '.claude-plugin/plugin.json'));
  const { icon, ...portableManifest } = manifest;
  portableManifest.repository = 'https://github.com/roydigerhund/easingwizard';
  const output = new Map([
    ['plugin.json', Buffer.from(json({
      $schema: `${schemaRoot}/plugin.schema.json`,
      ...portableManifest,
      extensions: {
        'com.openai': {
          interface: {
            displayName: 'Easing Wizard',
            shortDescription: 'CSS easing curves and motion advice',
            longDescription: 'Recommend curves, review CSS/Tailwind animations, and implement requested motion improvements with exact values and preview links.',
            developerName: 'Matthias Martin',
            category: 'Developer Tools',
            websiteURL: 'https://easingwizard.com',
            defaultPrompt: ['Recommend an easing for my dropdown.', 'Review the animations in this project.'],
            composerIcon: './assets/icon.png',
            logo: './assets/icon.png',
          },
        },
      },
    }))],
    ['mcp.json', Buffer.from(json({
      $schema: `${schemaRoot}/mcp.schema.json`,
      ...await readJson(join(sourceRoot, '.mcp.json')),
    }))],
  ]);
  for (const path of await filesUnder(sourceRoot, 'skills')) {
    const content = await readFile(join(sourceRoot, path));
    output.set(path, path.endsWith('/SKILL.md') ? Buffer.from(portableSkill(content.toString())) : content);
  }
  const agent = await readFile(join(sourceRoot, 'agents/animation-expert.md'), 'utf8');
  output.set('skills/animation-expert/SKILL.md', Buffer.from(portableSkill(agent, true)));
  for (const entry of ['references', 'assets', 'LICENSE']) {
    for (const path of await filesUnder(sourceRoot, entry)) output.set(path, await readFile(join(sourceRoot, path)));
  }
  return output;
}

export async function syncCodexPlugin(root = repoRoot) {
  const expected = await expectedCodexFiles(root);
  const target = join(root, codexPath);
  // These directories are explicitly generated, never independent authoring sources.
  for (const path of generatedRoots) await rm(join(target, path), { recursive: true, force: true });
  for (const [path, content] of expected) {
    await mkdir(dirname(join(target, path)), { recursive: true });
    await writeFile(join(target, path), content);
  }
}

export async function validatePlugins(root = repoRoot) {
  const claude = join(root, claudePath);
  const codex = join(root, codexPath);
  const manifest = await readJson(join(claude, '.claude-plugin/plugin.json'));
  const mcp = await readJson(join(claude, '.mcp.json'));
  const mcpPackage = await readJson(join(root, 'apps/mcp/package.json'));
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/, 'Plugin version must be semver');
  assert.equal(manifest.name, 'easingwizard');
  assert.deepEqual(mcp, { mcpServers: { easingwizard: {
    type: 'stdio', command: 'npx', args: ['-y', `@easingwizard/mcp-server@${mcpPackage.version}`],
  } } }, 'Plugin MCP pin must exactly match apps/mcp/package.json');

  const expected = await expectedCodexFiles(root);
  for (const [path, content] of expected) {
    const actual = await readFile(join(codex, path)).catch(() => null);
    assert(actual?.equals(content), `Generated Codex file differs: ${path}; run node scripts/package-plugins.mjs --sync`);
  }
  for (const path of generatedRoots) {
    for (const file of await filesUnder(codex, path)) assert(expected.has(file), `Stale generated Codex file: ${file}`);
  }
  assert(!(await readdir(codex)).some((name) => ['hooks', 'agents', '.mcp.json', '.codex-plugin'].includes(name)),
    'Portable Codex package must not contain legacy overlays, Claude agents, or lifecycle hooks');

  const prefix = `mcp__plugin_${manifest.name}_easingwizard__`;
  const toolIds = [...(await readFile(join(root, 'packages/core/src/text/endpoints.ts'), 'utf8'))
    .matchAll(/toolId: '([^']+)'/g)].map((match) => match[1]);
  for (const plugin of [claude, codex]) {
    for (const path of (await filesUnder(plugin)).filter((name) => name.endsWith('.md') && !['README.md', 'CHANGELOG.md'].includes(name))) {
      const text = await readFile(join(plugin, path), 'utf8');
      if (path.endsWith('/SKILL.md')) {
        const skill = text.match(/^---\n([\s\S]*?)\n---\n/);
        assert(skill, `Missing skill frontmatter: ${path}`);
        const name = skill[1].match(/^name: (.+)$/m)?.[1];
        assert.equal(name, path.split('/').at(-2), `Skill name must match directory: ${path}`);
        assert.match(skill[1], /^description: .+$/m, `Missing description: ${path}`);
      }
      for (const match of text.matchAll(/mcp__[\w-]+__[\w-]+/g)) {
        assert(plugin === claude && match[0].startsWith(prefix), `Wrong MCP tool namespace in ${path}: ${match[0]}`);
        assert(toolIds.includes(match[0].slice(prefix.length)), `Unknown MCP tool in ${path}: ${match[0]}`);
      }
      assert(!/verbose\s*:\s*true/.test(text), `Unsupported MCP argument in ${path}`);
      for (const match of text.matchAll(/\]\((\.{1,2}\/[^)]+)\)/g)) {
        const target = resolve(dirname(join(plugin, path)), match[1]);
        const inside = relative(plugin, target);
        assert(inside && inside !== '..' && !inside.startsWith(`..${sep}`), `Reference escapes package: ${path}`);
        assert((await lstat(target)).isFile(), `Missing reference in ${path}: ${match[1]}`);
      }
    }
  }
  return { version: manifest.version, mcpVersion: mcpPackage.version };
}

// Small deterministic ZIP writer (stored entries, no compression dependency).
// Fixed 1980-01-01 timestamp and POSIX modes make archives independent of mtimes.
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function createZip(entries) {
  const local = [], central = [];
  let offset = 0;
  for (const { path, content, executable = false } of [...entries].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)) {
    assert(!path.startsWith('/') && !path.split('/').includes('..') && !path.includes('\\'), `Unsafe ZIP path: ${path}`);
    const name = Buffer.from(path);
    const checksum = crc32(content);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x800, 6); // UTF-8 filenames.
    header.writeUInt16LE(33, 12); // DOS date 1980-01-01; time zero.
    header.writeUInt32LE(checksum, 14);
    header.writeUInt32LE(content.length, 18);
    header.writeUInt32LE(content.length, 22);
    header.writeUInt16LE(name.length, 26);
    local.push(header, name, content);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(0x0314, 4); // Unix, ZIP 2.0.
    header.copy(directory, 6, 4, 30);
    directory.writeUInt32LE(((executable ? 0o100755 : 0o100644) << 16) >>> 0, 38);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, name);
    offset += header.length + name.length + content.length;
  }
  const centralData = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralData.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, centralData, end]);
}

export async function packagePlugins({ root = repoRoot, outDir = join(root, 'dist/plugins') } = {}) {
  const { version } = await validatePlugins(root);
  const sums = [];
  await mkdir(outDir, { recursive: true });
  for (const [host, directory, includes] of [
    ['claude', claudePath, ['.claude-plugin', '.mcp.json', 'agents', 'hooks', 'scripts', 'skills', 'references', 'assets', 'README.md', 'CHANGELOG.md', 'LICENSE']],
    ['codex', codexPath, ['plugin.json', 'mcp.json', 'skills', 'references', 'assets', 'README.md', 'LICENSE']],
  ]) {
    const plugin = join(root, directory);
    const entries = [];
    for (const entry of includes) {
      for (const path of await filesUnder(plugin, entry)) entries.push({
        path, content: await readFile(join(plugin, path)), executable: path.endsWith('.sh'),
      });
    }
    const archive = createZip(entries);
    const filename = `easingwizard-${host}-${version}.zip`;
    await writeFile(join(outDir, filename), archive);
    sums.push(`${createHash('sha256').update(archive).digest('hex')}  ${filename}`);
  }
  await writeFile(join(outDir, 'SHA256SUMS'), `${sums.join('\n')}\n`);
  return sums;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--sync') {
    await syncCodexPlugin();
    console.log('Generated portable Codex plugin from apps/claude-plugin.');
  } else if (args.length === 1 && args[0] === '--check') {
    const result = await validatePlugins();
    console.log(`Plugins ${result.version} validated; MCP ${result.mcpVersion}; generated files are in sync.`);
  } else if (args.length === 0 || (args.length === 2 && args[0] === '--out-dir')) {
    const outDir = args.length ? resolve(args[1]) : join(repoRoot, 'dist/plugins');
    const sums = await packagePlugins({ outDir });
    console.log(`Packaged plugins in ${outDir}\n${sums.join('\n')}`);
  } else throw new Error('Usage: node scripts/package-plugins.mjs [--sync | --check | --out-dir PATH]');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
