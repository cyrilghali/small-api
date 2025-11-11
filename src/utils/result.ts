export interface Failure<E> {
  error: E;
  ok: false;
}

export type Result<T, E = string> = Failure<E> | Success<T>;

export interface Success<T> {
  ok: true;
  value: T;
}

export const ok = <T>(value: T): Result<T> => ({
  ok: true,
  value,
});

export const err = <E = string>(error: E): Result<any, E> => ({
  error,
  ok: false,
});
