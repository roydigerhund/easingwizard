import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const json = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));
const mcp = await json('apps/mcp/package.json');
const claude = await json('apps/claude-plugin/.claude-plugin/plugin.json');
const codex = await json('apps/codex-plugin/plugin.json');
assert.match(mcp.version, /^\d+\.\d+\.\d+$/);
assert.equal(claude.version, codex.version, 'Claude and Codex plugin releases must share a version');
assert.equal(mcp.private, undefined, 'The MCP package must remain publishable');
assert.equal(mcp.dependencies['easingwizard-core'], undefined, 'Private core must be bundled into the MCP artifact');
for (const path of ['apps/claude-plugin/.mcp.json', 'apps/codex-plugin/mcp.json']) {
  const config = await json(path);
  assert.deepEqual(config.mcpServers.easingwizard.args, ['-y', `${mcp.name}@${mcp.version}`], path);
}
const catalog = await json('.agents/plugins/marketplace.json');
assert.ok(catalog.plugins.some((entry) => entry.source.path === './apps/codex-plugin'));
if (process.env.GITHUB_REF_TYPE === 'tag') {
  assert.equal(process.env.GITHUB_REF_NAME, `mcp-v${mcp.version}`, 'Release tag must match MCP version');
}
const validation = spawnSync(process.execPath, ['scripts/package-plugins.mjs', '--check'], {
  cwd: root,
  stdio: 'inherit',
});
if (validation.status !== 0) process.exit(validation.status ?? 1);
console.log(`Release versions agree: MCP ${mcp.version}; Claude/Codex plugins ${claude.version}`);
