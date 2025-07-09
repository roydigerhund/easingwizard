import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { Demo } from "./types";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  const demo: Demo = {
    foo: "bar",
    bar: 42,
  };
  return c.json({ message: "Hello Hono!", demo });
});

export default handle(app);
