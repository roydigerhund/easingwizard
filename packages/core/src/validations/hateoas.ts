import z from 'zod/v4';
import { API_VERSION, FRONTEND_URL } from '~/data/globals';

export const curveLinksResponseSchema = z
  .object({
    self: z.string().meta({
      description: 'Link to this curve resource',
      example: `/${API_VERSION}/curves/0a0d.25e.1f.75g.914`,
    }),
    share_url: z.url().meta({
      description: 'Shareable URL for this curve',
      example: `${FRONTEND_URL}/#0a0d.25e.1f.75g.914`,
    }),
    create: z.string().meta({
      description: 'Endpoint to create curves of this type',
      example: `/${API_VERSION}/curves/bezier`,
    }),
  })
  .meta({
    title: 'Easing Curve Links Response',
    description: 'HATEOAS navigation links for the easing curve',
  });

export type CurveLinksResponse = z.infer<typeof curveLinksResponseSchema>;

export const presetsLinksResponseSchema = z
  .object({
    self: z.string().meta({
      description: 'Link to this presets collection',
      example: `/${API_VERSION}/presets`,
    }),
    filter: z.string().meta({
      description: 'Template for filtering presets by type',
      example: `/${API_VERSION}/presets{?type}`,
    }),
  })
  .meta({
    title: 'Presets Links Response',
    description: 'HATEOAS navigation links',
  });

export type PresetsLinksResponse = z.infer<typeof presetsLinksResponseSchema>;
