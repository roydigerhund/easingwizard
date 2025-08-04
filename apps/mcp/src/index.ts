#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import {
  BezierEasingCurveResponseSchema,
  BezierParamsSchema,
  BounceEasingCurveResponseSchema,
  BounceParamsSchema,
  CurveIdSchema,
  EasingTypeSchema,
  endpointTexts,
  healthCheckSchema,
  NonUnionEasingCurveResponseSchema,
  OvershootEasingCurveResponseSchema,
  OvershootParamsSchema,
  PresetsResponseSchema,
  SpringEasingCurveResponseSchema,
  SpringParamsSchema,
  WiggleEasingCurveResponseSchema,
  WiggleParamsSchema,
} from 'easing-wizard-core';
import z from 'zod/v4';

// Base URL for the Easing Wizard API
const BASE_URL = 'https://api.easingwizard.com/v1';

// Helper function to make API requests
async function makeApiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new McpError(
      ErrorCode.InternalError,
      `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return response.json();
}

// Create the server
const server = new Server(
  {
    name: 'easing-wizard-server',
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
  {
    name: endpointTexts.healthCheck.id,
    title: endpointTexts.healthCheck.title,
    description: endpointTexts.healthCheck.description,
    inputSchema: z.object({}),
    outputSchema: healthCheckSchema,
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
      case 'get_presets': {
        const queryParams = new URLSearchParams();
        if (args?.type && typeof args.type === 'string') {
          queryParams.append('type', args.type);
        }
        const endpoint = `/presets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const result = await makeApiRequest(endpoint);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_curve_by_id': {
        if (!args?.id) {
          throw new McpError(ErrorCode.InvalidParams, 'Missing required parameter: id');
        }
        const result = await makeApiRequest(`/curves/${args.id}`);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_bezier_curve': {
        const params = BezierParamsSchema.parse(args);
        const result = await makeApiRequest('/curves/bezier', {
          method: 'POST',
          body: JSON.stringify(params),
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_spring_curve': {
        const params = SpringParamsSchema.parse(args);
        const result = await makeApiRequest('/curves/spring', {
          method: 'POST',
          body: JSON.stringify(params),
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_bounce_curve': {
        const params = BounceParamsSchema.parse(args);
        const result = await makeApiRequest('/curves/bounce', {
          method: 'POST',
          body: JSON.stringify(params),
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_wiggle_curve': {
        const params = WiggleParamsSchema.parse(args);
        const result = await makeApiRequest('/curves/wiggle', {
          method: 'POST',
          body: JSON.stringify(params),
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_overshoot_curve': {
        const params = OvershootParamsSchema.parse(args);
        const result = await makeApiRequest('/curves/overshoot', {
          method: 'POST',
          body: JSON.stringify(params),
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'health_check': {
        const result = await makeApiRequestWithCustomUrl('/healthz', {}, 'https://api.easingwizard.com');

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
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

// Fix the health check URL
async function makeApiRequestWithCustomUrl(endpoint: string, options: RequestInit = {}, baseUrl?: string) {
  const url = `${baseUrl || BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new McpError(
      ErrorCode.InternalError,
      `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return response.json();
}

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
