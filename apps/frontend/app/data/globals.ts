import { getEnv } from '~/utils/env';

export const frontendUrl = getEnv().VITE_FRONTEND_URL;
export const title = 'Easing Wizard - CSS Easing Editor and Generator';
export const description =
  'Generate and customize CSS easing functions with ease and magical precision using Easing Wizard 🧙';

// Integrations & external resources
export const apiUrl = 'https://api.easingwizard.com';
export const apiDocsUrl = apiUrl + '/docs';
export const mcpNpmUrl = 'https://www.npmjs.com/package/@easingwizard/mcp-server';
export const pluginUrl = 'https://github.com/roydigerhund/easingwizard-claude-plugin';
export const githubUrl = 'https://github.com/roydigerhund/easingwizard';
