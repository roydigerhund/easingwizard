import { defaultEasingState } from '~/state';

// Replace the following with the fixed default values when V1 is introduced
// Override mass defaults to 1 for backward compatibility with old shared URLs
// that predate the mass parameter (old custom URLs had no mass, which was implicitly 1)
export const DEFAULTS_V0 = {
  ...defaultEasingState,
  bounceMass: 1,
  wiggleMass: 1,
};
