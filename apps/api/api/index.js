import { getRequestListener } from '@hono/node-server';
import app from '../dist/app.js';
export default getRequestListener(app.fetch);
