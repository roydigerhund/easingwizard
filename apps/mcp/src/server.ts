import { McpServer } from '@modelcontextprotocol/server';
import {
  BezierEasingCurveResponseSchema,
  BezierParamsSchema,
  BounceEasingCurveResponseSchema,
  BounceParamsSchema,
  createCurveResponseFromId,
  createCurveResponseFromInput,
  createPresetsResponse,
  CurveIdSchema,
  EasingTypeSchema,
  endpointTexts,
  NonUnionEasingCurveResponseSchema,
  OvershootEasingCurveResponseSchema,
  OvershootParamsSchema,
  PresetsResponseSchema,
  SpringEasingCurveResponseSchema,
  SpringParamsSchema,
  WiggleEasingCurveResponseSchema,
  WiggleParamsSchema,
} from 'easingwizard-core';
import z from 'zod/v4';
import packageJson from '../package.json' with { type: 'json' };

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function result<T extends Record<string, unknown>>(structuredContent: T) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(structuredContent) }],
    structuredContent,
  };
}

/** Builds an independent instance for one stdio connection or HTTP request. */
export function createEasingWizardServer() {
  const server = new McpServer(
    {
      name: 'easingwizard',
      version: packageJson.version,
      title: 'Easing Wizard',
      websiteUrl: 'https://easingwizard.com',
    },
    {
      instructions:
        'Calculate CSS easing curves locally without network access or persistent changes. ' +
        'Use get_presets with a type filter to find a starting curve, then a create_*_curve tool to customize it. ' +
        'Use HIGH accuracy for normal UI animations. Copy output.css or output.tailwind_css exactly; ' +
        'use output.suggested_duration_ms when supplied and links.share_url for the visual editor. ' +
        'A curve ID encodes its parameters; get_curve_by_id reconstructs it without a database.',
      maxToolInputElements: 32,
    },
  );

  server.registerTool(
    endpointTexts.getPresets.toolId,
    {
      title: endpointTexts.getPresets.title,
      description: endpointTexts.getPresets.description,
      inputSchema: z.object({ type: EasingTypeSchema.optional() }).strict(),
      outputSchema: PresetsResponseSchema,
      annotations,
    },
    async ({ type }) => result(await createPresetsResponse(type)),
  );

  server.registerTool(
    endpointTexts.getCurveById.toolId,
    {
      title: endpointTexts.getCurveById.title,
      description: endpointTexts.getCurveById.description,
      inputSchema: z.object({ id: CurveIdSchema }).strict(),
      // Keep an object-root schema for clients using the 2025 protocol revisions.
      outputSchema: NonUnionEasingCurveResponseSchema,
      annotations,
    },
    async ({ id }) => result(createCurveResponseFromId(id)),
  );

  server.registerTool(
    endpointTexts.createBezierCurve.toolId,
    {
      title: endpointTexts.createBezierCurve.title,
      description: endpointTexts.createBezierCurve.description,
      inputSchema: BezierParamsSchema.strict(),
      outputSchema: BezierEasingCurveResponseSchema,
      annotations,
    },
    async (config) => result(createCurveResponseFromInput({ type: 'BEZIER', config })),
  );

  server.registerTool(
    endpointTexts.createSpringCurve.toolId,
    {
      title: endpointTexts.createSpringCurve.title,
      description: endpointTexts.createSpringCurve.description,
      inputSchema: SpringParamsSchema.strict(),
      outputSchema: SpringEasingCurveResponseSchema,
      annotations,
    },
    async (config) => result(createCurveResponseFromInput({ type: 'SPRING', config })),
  );

  server.registerTool(
    endpointTexts.createBounceCurve.toolId,
    {
      title: endpointTexts.createBounceCurve.title,
      description: endpointTexts.createBounceCurve.description,
      inputSchema: BounceParamsSchema.strict(),
      outputSchema: BounceEasingCurveResponseSchema,
      annotations,
    },
    async (config) => result(createCurveResponseFromInput({ type: 'BOUNCE', config })),
  );

  server.registerTool(
    endpointTexts.createWiggleCurve.toolId,
    {
      title: endpointTexts.createWiggleCurve.title,
      description: endpointTexts.createWiggleCurve.description,
      inputSchema: WiggleParamsSchema.strict(),
      outputSchema: WiggleEasingCurveResponseSchema,
      annotations,
    },
    async (config) => result(createCurveResponseFromInput({ type: 'WIGGLE', config })),
  );

  server.registerTool(
    endpointTexts.createOvershootCurve.toolId,
    {
      title: endpointTexts.createOvershootCurve.title,
      description: endpointTexts.createOvershootCurve.description,
      inputSchema: OvershootParamsSchema.strict(),
      outputSchema: OvershootEasingCurveResponseSchema,
      annotations,
    },
    async (config) => result(createCurveResponseFromInput({ type: 'OVERSHOOT', config })),
  );

  // McpServer validates inputs/outputs and returns thrown tool errors as isError.
  return server;
}
