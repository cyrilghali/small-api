import type { JSONValue } from "#types/payload.types";

export interface Failure<E> {
  error: E;
  ok: false;
}

export type ResultHelper<T, E = string> = Failure<E> | Success<T>;

export interface Success<T> {
  ok: true;
  value: T;
}

export const ok = <T>(value: T): ResultHelper<T> => ({
  ok: true,
  value,
});

export const err = <E = string>(error: E): ResultHelper<JSONValue, E> => ({
  error,
  ok: false,
});
