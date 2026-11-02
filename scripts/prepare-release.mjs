import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { smokePackedMcp } from './smoke-packed-mcp.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const releaseDir = path.join(root, 'dist/releases');
const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

// Always check before packaging: these artifacts are the release source of truth.
run('pnpm', ['check']);
run('pnpm', ['build']);
run('pnpm', ['audit', '--prod', '--audit-level=high']);
run('pnpm', ['plugins:package']);
await rm(releaseDir, { recursive: true, force: true });
await mkdir(releaseDir, { recursive: true });
run('pnpm', ['--dir', 'apps/mcp', 'pack', '--pack-destination', releaseDir]);
const tarballs = (await readdir(releaseDir)).filter((name) => name.endsWith('.tgz'));
if (tarballs.length !== 1) throw new Error('Expected exactly one MCP tarball');
await smokePackedMcp(path.join(releaseDir, tarballs[0]));
const mcp = JSON.parse(await readFile(path.join(root, 'apps/mcp/package.json'), 'utf8'));
const plugin = JSON.parse(await readFile(path.join(root, 'apps/codex-plugin/plugin.json'), 'utf8'));
for (const host of ['claude', 'codex']) {
  const name = `easingwizard-${host}-${plugin.version}.zip`;
  await copyFile(path.join(root, 'dist/plugins', name), path.join(releaseDir, name));
}
await cp(path.join(root, 'apps/claude-plugin'), path.join(releaseDir, 'claude-plugin-repository'), { recursive: true });
const files = {};
for (const name of (await readdir(releaseDir)).filter((name) => /\.(zip|tgz)$/.test(name)).sort()) {
  files[name] = createHash('sha256')
    .update(await readFile(path.join(releaseDir, name)))
    .digest('hex');
}
const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
const status = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
await writeFile(
  path.join(releaseDir, 'release.json'),
  JSON.stringify(
    {
      mcpVersion: mcp.version,
      pluginVersion: plugin.version,
      sourceCommit: git.status === 0 ? git.stdout.trim() : null,
      uncommittedChanges: status.status !== 0 || status.stdout.trim().length > 0,
      sha256: files,
      claudeRepository: 'https://github.com/roydigerhund/easingwizard-claude-plugin',
      marketplace: 'https://github.com/roydigerhund/easingwizard-claude-plugin',
      marketplaceEntry: 'easingwizard',
    },
    null,
    2,
  ) + '\n',
);
await writeFile(
  path.join(releaseDir, 'SHA256SUMS'),
  Object.entries(files)
    .map(([name, hash]) => `${hash}  ${name}`)
    .join('\n') + '\n',
);
console.log(`Prepared and checked release artifacts: ${releaseDir}`);
