import { spawnSync } from 'node:child_process';
import { cp, readdir, realpath, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const source = path.join(root, 'apps/claude-plugin');
const destinationArg = process.argv[2];
if (!destinationArg)
  throw new Error('Usage: pnpm release:sync-plugin /path/to/clean/easingwizard-claude-plugin-checkout');
const destination = await realpath(path.resolve(destinationArg));
if (destination === root || destination.startsWith(root + path.sep))
  throw new Error('Use a separate repository checkout');
const git = (...args) => {
  const result = spawnSync('git', ['-C', destination, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim() || 'Git command failed');
  return result.stdout.trim();
};
if (git('status', '--porcelain')) throw new Error('Destination checkout has changes; refusing to overwrite them');
if ((await realpath(git('rev-parse', '--show-toplevel'))) !== destination) throw new Error('Pass the repository root');
if (!/[:/]roydigerhund\/easingwizard-claude-plugin(?:\.git)?$/.test(git('remote', 'get-url', 'origin'))) {
  throw new Error('Destination origin must be roydigerhund/easingwizard-claude-plugin');
}
const validation = spawnSync(process.execPath, ['scripts/package-plugins.mjs', '--check'], {
  cwd: root,
  stdio: 'inherit',
});
if (validation.status !== 0) throw new Error('Plugin source validation failed; destination was not changed');
// Only these plugin-owned components are replaced; repository settings/history remain intact.
const components = [
  '.claude-plugin',
  '.mcp.json',
  'skills',
  'agents',
  'commands',
  'hooks',
  'scripts',
  'references',
  'assets',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
];
const present = new Set(await readdir(source));
for (const component of components) {
  await rm(path.join(destination, component), { recursive: true, force: true });
  if (present.has(component))
    await cp(path.join(source, component), path.join(destination, component), { recursive: true });
}
await stat(path.join(destination, '.claude-plugin/plugin.json'));
console.log(git('diff', '--stat'));
console.log(
  'Plugin source synchronized. Review, commit and push this checkout, then update the marketplace source.sha to that commit.',
);
