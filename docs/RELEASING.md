# Release Easing Wizard

The monorepo is the source of truth for the MCP engine and both agent plugins. Author skill guidance in `apps/claude-plugin`; `pnpm plugins:sync` generates the portable Codex package. Do not edit its generated skills, references, assets, or manifests independently.

## Prepare one consistent release

1. Update the MCP version in `apps/mcp/package.json` when the engine changes.
2. Update `apps/claude-plugin/.mcp.json` to that exact npm version, and bump `.claude-plugin/plugin.json` when plugin contents or its MCP pin change.
3. Update the Claude changelog, run `pnpm plugins:sync`, and review the generated Codex changes. Both plugins share the plugin version; the MCP engine has its own version.
4. Run `pnpm release:prepare` from the repository root. This checks types, tests, plugin drift, release versions, and production dependency advisories; builds all apps; and prepares npm and plugin archives. The final npm tarball is tested outside the checkout over stdio and HTTP before release metadata is written.

Provide `API_URL` and `VITE_FRONTEND_URL` in the environment when building without the local `.env` files. CI sets both production URLs. Node 22.14+ and the package-manager version from `package.json` are required.

`dist/releases/` contains:

- The publishable MCP `.tgz`.
- Claude and Codex plugin ZIPs.
- `SHA256SUMS` and `release.json`, recording versions, source commit, uncommitted-change status, and artifact hashes.
- An exported `claude-plugin-repository/` for reviewing the standalone plugin contents.

The **Prepare release** GitHub workflow produces the same artifacts on manual dispatch or an `mcp-v<version>` tag. A tag must match the MCP package version. CI does not publish npm packages, push the plugin repository, install plugins, or deploy Vercel projects.

## Publish in dependency order

1. Publish the tested MCP tarball first, using an npm account authorized for `@easingwizard/mcp-server`:

   ```bash
   pnpm publish ./dist/releases/easingwizard-mcp-server-1.2.0.tgz --access public --no-git-checks
   ```

   Substitute the filename from the prepared release. Verify that the new version is available before distributing a plugin that pins it. A plugin install cannot use an unpublished npm version.

2. Synchronize the standalone Claude repository from the monorepo:

   ```bash
   pnpm release:sync-plugin /absolute/path/to/easingwizard-claude-plugin
   ```

   The helper requires a clean, separate checkout with the expected `origin`. It replaces only plugin-owned paths and leaves Git history/settings intact. Review its diff, commit, and push normally; it never commits or pushes for you. Preserve the exact published commit SHA.

3. Update the `easing-wizard` entry in `anthropics/claude-plugins-community/.claude-plugin/marketplace.json` to the standalone repository's new `source.sha`, and submit that marketplace change. Updating the monorepo or an unpinned branch alone does not update the community listing. An update is publicly available only after the marketplace change is merged and clients refresh it.

4. Publish the monorepo changes so Codex users can add the repository marketplace and install `easingwizard@easingwizard`. A repository marketplace is separate from the public OpenAI directory. Public local-MCP submissions require eligibility; use a remote HTTPS submission for a broadly available hosted plugin. See the [Codex plugin README](../apps/codex-plugin/README.md).

5. Deploy the API and frontend through their existing Vercel projects. Publishing npm does not deploy `/mcp`. On the API project, use `pnpm install --frozen-lockfile`, the existing root build command, production `API_URL`, and any additional `MCP_ALLOWED_ORIGINS`/`MCP_ALLOWED_HOSTS`. The preview hostname in `VERCEL_URL` is supported automatically. See [API configuration](../apps/api/README.md).

## Acceptance after publication

Use a clean client installation, check that seven tools are listed, create a curve and reload it by ID, and verify that invalid parameters return a recoverable tool error. Test both Claude skills and Codex skills in a new chat. Check the API's versioned self-links and connect a remote MCP client to the actual deployed HTTPS `/mcp` endpoint. Record the npm version, plugin versions, marketplace SHA, deployment URLs, and results separately from the local build result.

The MCP engine includes the project's custom license; the instruction-only plugins retain their existing MIT license. Packaging preserves this distinction.
