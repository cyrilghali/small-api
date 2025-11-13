/**
 * Represents arbitrary JSON payload data
 * Used when the API accepts JSON payloads of any structure
 * The any type is appropriate here because clients can send any valid JSON
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- API accepts arbitrary JSON payloads of any structure
export type JSONPayload = Record<string, any>;

/**
 * Represents arbitrary JSON values (primitive, object, or array)
 * Used for recursive JSON processing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Must accept any JSON value type to handle all structures
export type JSONValue = any;
