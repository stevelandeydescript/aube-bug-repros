import type { Opaque } from 'type-fest';

// Export the function but NOT the type alias — forces consumers' declaration
// emit to reference Opaque from type-fest directly.
export function createUserId(raw: string): Opaque<string, 'UserId'> {
    return raw as Opaque<string, 'UserId'>;
}
