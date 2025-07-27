import z from 'zod/v4';
import { API_URL, FRONTEND_URL } from '~/data/globals';

export const curveLinksResponseSchema = z
  .object({
    self: z.url().meta({
      description: 'Link to this curve resource',
      example: `${API_URL}/curves/abc123def`,
    }),
    share_url: z.url().meta({
      description: 'Shareable URL for this curve',
      example: `${FRONTEND_URL}/#abc123def`,
    }),
    create: z.url().meta({
      description: 'Endpoint to create curves of this type',
      example: `${API_URL}/curves/bezier`,
    }),
  })
  .meta({
    id: 'ResponseLinks',
    description: 'HATEOAS navigation links for the easing curve',
  });

export type CurveLinksResponse = z.infer<typeof curveLinksResponseSchema>;

export const presetsLinksResponseSchema = z
  .object({
    self: z.url().meta({
      description: 'Link to this presets collection',
      example: `${API_URL}/presets`,
    }),
    filter: z.string().meta({
      description: 'Template for filtering presets by type',
      example: `${API_URL}/presets{?type}`,
    }),
  })
  .meta({
    description: 'HATEOAS navigation links',
  });

export type PresetsLinksResponse = z.infer<typeof presetsLinksResponseSchema>;
