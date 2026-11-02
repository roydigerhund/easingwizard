import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, lstat, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { packagePlugins, repoRoot, syncCodexPlugin, validatePlugins } from '../scripts/package-plugins.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'easingwizard-plugins-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const path of ['apps/claude-plugin', 'apps/codex-plugin']) {
    await cp(join(repoRoot, path), join(root, path), { recursive: true });
  }
  for (const path of ['apps/mcp/package.json', 'packages/core/src/text/endpoints.ts']) {
    const target = join(root, path);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, await readFile(join(repoRoot, path)));
  }
  return root;
}

test('release archives extract with intact data, references, modes, and stable hashes', async (t) => {
  const root = await fixture(t);
  const first = join(root, 'first'), second = join(root, 'second');
  const sums = await packagePlugins({ root, outDir: first });
  assert.deepEqual(await packagePlugins({ root, outDir: second }), sums);
  for (const sum of sums) {
    const [hash, name] = sum.split('  ');
    const bytes = await readFile(join(first, name));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
    assert.deepEqual(bytes, await readFile(join(second, name)));
    // An independent ZIP implementation checks the format and all entry CRCs.
    execFileSync('unzip', ['-t', join(first, name)], { stdio: 'pipe' });
    const listing = execFileSync('unzip', ['-Z1', join(first, name)], { encoding: 'utf8' }).trim().split('\n');
    assert(listing.includes('references/motion-design.md'));
    assert(listing.includes('assets/icon.png'));
    assert(listing.every((path) => !path.includes('node_modules') && !path.includes('..')));
    if (name.includes('-codex-')) {
      assert(listing.includes('plugin.json'));
      assert(listing.includes('mcp.json'));
      assert(listing.includes('skills/animation-expert/SKILL.md'));
      assert(!listing.some((path) => path.startsWith('hooks/') || path.startsWith('agents/')));
      const manifest = JSON.parse(execFileSync('unzip', ['-p', join(first, name), 'plugin.json'], { encoding: 'utf8' }));
      assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
      const source = await readFile(join(root, 'apps/codex-plugin/skills/improve-easings/SKILL.md'));
      assert.deepEqual(execFileSync('unzip', ['-p', join(first, name), 'skills/improve-easings/SKILL.md']), source);
    } else {
      assert(listing.includes('.claude-plugin/plugin.json'));
      assert(listing.includes('.mcp.json'));
      assert(listing.includes('hooks/hooks.json'));
      const extracted = join(root, 'extracted');
      execFileSync('unzip', ['-q', join(first, name), '-d', extracted]);
      assert.equal((await lstat(join(extracted, 'scripts/detect-animation-project.sh'))).mode & 0o777, 0o755);
    }
  }
});

test('generated drift and an MCP release mismatch stop packaging', async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, 'apps/codex-plugin/skills/easing-advice/SKILL.md'), 'out of date\n');
  await assert.rejects(validatePlugins(root), /Generated Codex file differs/);
  await syncCodexPlugin(root);
  await validatePlugins(root);
  const mcpPath = join(root, 'apps/mcp/package.json');
  const mcp = JSON.parse(await readFile(mcpPath, 'utf8'));
  mcp.version = '99.0.0';
  await writeFile(mcpPath, JSON.stringify(mcp));
  await assert.rejects(packagePlugins({ root }), /MCP pin must exactly match/);
});

test('plugin namespacing and references are checked after shared-source regeneration', async (t) => {
  const root = await fixture(t);
  const agentPath = join(root, 'apps/claude-plugin/agents/animation-expert.md');
  const original = await readFile(agentPath, 'utf8');
  await writeFile(agentPath, original.replace('mcp__plugin_easingwizard_easingwizard__get_presets', 'mcp__easingwizard__get_presets'));
  await syncCodexPlugin(root);
  await assert.rejects(validatePlugins(root), /Wrong MCP tool namespace/);
  await writeFile(agentPath, original.replace('../references/motion-design.md', '../references/missing.md'));
  await syncCodexPlugin(root);
  await assert.rejects(validatePlugins(root), /ENOENT/);
});

test('the Claude startup hook works when both plugin and project paths contain spaces', async (t) => {
  const root = await fixture(t);
  const plugin = join(root, 'plugin with spaces');
  const project = join(root, 'project with spaces');
  await cp(join(root, 'apps/claude-plugin'), plugin, { recursive: true });
  await mkdir(project);
  const hooks = JSON.parse(await readFile(join(plugin, 'hooks/hooks.json'), 'utf8'));
  const command = hooks.hooks.SessionStart[0].hooks[0].command;
  const output = execFileSync('bash', ['-c', command], {
    cwd: root,
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: plugin, CLAUDE_PROJECT_DIR: project },
    encoding: 'utf8',
  });
  const payload = JSON.parse(output);
  assert.equal(payload.hookSpecificOutput.hookEventName, 'SessionStart');
  assert(payload.hookSpecificOutput.additionalContext.includes('/easingwizard:recommend-curve'));
});
