import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const syncScript = join(root, 'scripts/sync-claude-plugin.mjs');
const gitEnv = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' };

async function checkout(t) {
  const directory = await mkdtemp(join(tmpdir(), 'easingwizard-plugin-sync-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: directory, env: gitEnv, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  };
  git('init', '-q', '-b', 'test');
  git('remote', 'add', 'origin', 'git@github.com:roydigerhund/easingwizard-claude-plugin.git');
  await mkdir(join(directory, 'commands'));
  await writeFile(join(directory, 'commands/legacy.md'), 'Retired command\n');
  await writeFile(join(directory, 'README.md'), 'Old plugin readme\n');
  await writeFile(join(directory, 'repository-maintenance.txt'), 'Preserve this repository-owned file.\n');
  git('add', '.');
  git(
    '-c',
    'user.name=Plugin Sync Test',
    '-c',
    'user.email=plugin-test@example.invalid',
    '-c',
    'commit.gpgsign=false',
    '-c',
    'core.hooksPath=/dev/null',
    'commit',
    '-qm',
    'Fixture',
  );
  return directory;
}

test('plugin sync removes retired commands and preserves unrelated repository files', async (t) => {
  const directory = await checkout(t);
  const result = spawnSync(process.execPath, [syncScript, directory], {
    cwd: root,
    env: gitEnv,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  await assert.rejects(lstat(join(directory, 'commands')), { code: 'ENOENT' });
  assert.equal(
    await readFile(join(directory, 'repository-maintenance.txt'), 'utf8'),
    'Preserve this repository-owned file.\n',
  );
  for (const path of ['README.md', '.mcp.json', '.claude-plugin/plugin.json', 'skills/recommend-curve/SKILL.md']) {
    assert.deepEqual(await readFile(join(directory, path)), await readFile(join(root, 'apps/claude-plugin', path)));
  }
  assert((await lstat(join(directory, '.git'))).isDirectory());
});

test('plugin sync refuses a dirty checkout before overwriting or removing files', async (t) => {
  const directory = await checkout(t);
  await writeFile(join(directory, 'README.md'), 'Uncommitted editorial work\n');
  const result = spawnSync(process.execPath, [syncScript, directory], {
    cwd: root,
    env: gitEnv,
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr + result.stdout, /Destination checkout has changes/);
  assert.equal(await readFile(join(directory, 'README.md'), 'utf8'), 'Uncommitted editorial work\n');
  assert.equal(await readFile(join(directory, 'commands/legacy.md'), 'utf8'), 'Retired command\n');
  assert.equal(
    await readFile(join(directory, 'repository-maintenance.txt'), 'utf8'),
    'Preserve this repository-owned file.\n',
  );
  await assert.rejects(lstat(join(directory, '.mcp.json')), { code: 'ENOENT' });
});
