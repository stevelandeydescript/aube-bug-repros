import { createUserId } from '@repro/lib';

// Re-export triggers declaration emit in app, which must express the return
// type. Since lib doesn't export a named type alias, the emitter must
// reference Opaque from type-fest directly.
export const defaultUser = createUserId('user-default');
