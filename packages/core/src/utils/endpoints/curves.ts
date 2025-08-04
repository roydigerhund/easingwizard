import { FRONTEND_URL } from '~/data/globals';
import type { EasingTypeKey } from '~/types/enums';
import type { EasingCurveResponse } from '~/validations/curve';
import { getApiResponseFromInput, getApiResponseFromState } from '../api';
import { rehydrateShareState } from '../state-sharing/state-serialization';
import { decodeState, encodeState } from '../state-sharing/url-code';

const createCurveLinks = (id: string, type: EasingTypeKey) => ({
  self: `/curves/${id}`,
  share_url: `${FRONTEND_URL}/#${id}`,
  create: `/curves/${type.toLowerCase()}`,
});

export const createCurveResponseFromId = (id: string): EasingCurveResponse => {
  const decodedState = decodeState(id);
  const rehydratedState = rehydrateShareState(decodedState);

  const data = getApiResponseFromState(rehydratedState);

  return {
    id,
    ...data,
    links: createCurveLinks(id, data.type),
    generated_at: new Date().toISOString(),
  };
};

export const createCurveResponseFromInput = ({
  type,
  config,
}: {
  type: EasingTypeKey;
  config: unknown;
}): EasingCurveResponse => {
  const { shareState, ...data } = getApiResponseFromInput(type, config);

  const id = encodeState(shareState);

  return {
    id,
    ...data,
    links: createCurveLinks(id, type),
    generated_at: new Date().toISOString(),
  };
};
