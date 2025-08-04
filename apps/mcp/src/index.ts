#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
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

// Create the server
const server = new Server(
  {
    name: 'easingwizard-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const toolMapping = [
  {
    name: endpointTexts.getPresets.id,
    title: endpointTexts.getPresets.title,
    description: endpointTexts.getPresets.description,
    inputSchema: z.object({ type: EasingTypeSchema.optional() }),
    outputSchema: PresetsResponseSchema,
  },
  {
    name: endpointTexts.getCurveById.id,
    title: endpointTexts.getCurveById.title,
    description: endpointTexts.getCurveById.description,
    inputSchema: z.object({ id: CurveIdSchema }),
    // Tool OutputSchema does not support unions on first level (yet)
    outputSchema: NonUnionEasingCurveResponseSchema,
  },
  {
    name: endpointTexts.createBezierCurve.id,
    title: endpointTexts.createBezierCurve.title,
    description: endpointTexts.createBezierCurve.description,
    inputSchema: BezierParamsSchema,
    outputSchema: BezierEasingCurveResponseSchema,
  },
  {
    name: endpointTexts.createSpringCurve.id,
    description: endpointTexts.createSpringCurve.description,
    title: endpointTexts.createSpringCurve.title,
    inputSchema: SpringParamsSchema,
    outputSchema: SpringEasingCurveResponseSchema,
  },
  {
    name: endpointTexts.createBounceCurve.id,
    description: endpointTexts.createBounceCurve.description,
    title: endpointTexts.createBounceCurve.title,
    inputSchema: BounceParamsSchema,
    outputSchema: BounceEasingCurveResponseSchema,
  },
  {
    name: endpointTexts.createWiggleCurve.id,
    description: endpointTexts.createWiggleCurve.description,
    title: endpointTexts.createWiggleCurve.title,
    inputSchema: WiggleParamsSchema,
    outputSchema: WiggleEasingCurveResponseSchema,
  },
  {
    name: endpointTexts.createOvershootCurve.id,
    description: endpointTexts.createOvershootCurve.description,
    title: endpointTexts.createOvershootCurve.title,
    inputSchema: OvershootParamsSchema,
    outputSchema: OvershootEasingCurveResponseSchema,
  },
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolMapping.map((tool) => {
      const rawInputSchema = z.toJSONSchema(tool.inputSchema, { io: 'input' });
      const inputSchema = { ...rawInputSchema, $schema: undefined };
      const rawOutputSchema = z.toJSONSchema(tool.outputSchema, { io: 'output' });
      const outputSchema = { ...rawOutputSchema, $schema: undefined };

      return {
        ...tool,
        inputSchema,
        outputSchema,
      };
    }),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case endpointTexts.getPresets.id: {
        const type = args?.type ? EasingTypeSchema.parse(args?.type) : undefined;

        const response = await createPresetsResponse(type);

        return { structuredContent: response };
      }

      case endpointTexts.getCurveById.id: {
        const id = CurveIdSchema.parse(args?.id);
        const response = createCurveResponseFromId(id);

        return { structuredContent: response };
      }

      case endpointTexts.createBezierCurve.id:
      case endpointTexts.createSpringCurve.id:
      case endpointTexts.createBounceCurve.id:
      case endpointTexts.createWiggleCurve.id:
      case endpointTexts.createOvershootCurve.id: {
        const type = EasingTypeSchema.parse(name.replace('create', '').replace('Curve', '').toUpperCase());
        const response = createCurveResponseFromInput({ type, config: args });

        return { structuredContent: response };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Easing Wizard MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
