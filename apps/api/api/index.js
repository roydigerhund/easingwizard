import { handle } from '@hono/node-server/vercel';
const { default: app } = await import('../dist/index.js');
export default handle(app);