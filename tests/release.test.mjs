import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { smokePackedMcp } from '../scripts/smoke-packed-mcp.mjs';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

test(
  'the actual npm tarball works outside the source checkout with runtime dependencies only',
  { timeout: 60_000 },
  async () => {
    const directory = await mkdtemp(join(tmpdir(), 'easingwizard-pack-test-'));
    try {
      execFileSync('pnpm', ['--dir', 'apps/mcp', 'pack', '--pack-destination', directory], {
        cwd: repoRoot,
        stdio: 'pipe',
        timeout: 40_000,
      });
      const archives = (await readdir(directory)).filter((file) => file.endsWith('.tgz'));
      assert.equal(archives.length, 1);
      const result = await smokePackedMcp(join(directory, archives[0]));
      assert.equal(result.tools, 7);
      assert.deepEqual(result.protocols, ['2025-06-18', '2026-07-28']);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);
