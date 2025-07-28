import z from 'zod/v4';
import { FRONTEND_URL } from '~/data/globals';

export const curveLinksResponseSchema = z
  .object({
    self: z.string().meta({
      description: 'Link to this curve resource',
      example: '/curves/abc123def',
    }),
    share_url: z.url().meta({
      description: 'Shareable URL for this curve',
      example: `${FRONTEND_URL}/#abc123def`,
    }),
    create: z.string().meta({
      description: 'Endpoint to create curves of this type',
      example: '/curves/bezier',
    }),
  })
  .meta({
    id: 'ResponseLinks',
    description: 'HATEOAS navigation links for the easing curve',
  });

export type CurveLinksResponse = z.infer<typeof curveLinksResponseSchema>;

export const presetsLinksResponseSchema = z
  .object({
    self: z.string().meta({
      description: 'Link to this presets collection',
      example: '/presets',
    }),
    filter: z.string().meta({
      description: 'Template for filtering presets by type',
      example: '/presets{?type}',
    }),
  })
  .meta({
    description: 'HATEOAS navigation links',
  });

export type PresetsLinksResponse = z.infer<typeof presetsLinksResponseSchema>;
