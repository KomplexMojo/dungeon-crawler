import { Ok, Err, Result } from "./Result";

/**
 * Chains two Result operations, propagating errors if any.
 * @param first - The first Result operation.
 * @param second - The function to execute if the first Result is Ok.
 * @returns A new Result based on the chained operations.
 */
export function andThen<T, U>(
  first: Result<T>,
  second: (value: T) => Result<U>
): Result<U> {
  if (first.isErr()) {
    // Access the 'error' property directly since the result is Err
    const errorResult = first as Err<T>;
    return new Err<U>(errorResult.error);
  }

  if (first.isOk()) {
    // Access the 'value' property directly since the result is Ok
    const okResult = first as Ok<T>;
    return second(okResult.value);
  }

  // Optional: Handle unexpected cases
  return new Err<U>("Unknown error in andThen.");
}

/**
 * Maps a Result value to another value using a provided mapper function.
 * @param result - The original Result.
 * @param mapper - The function to map the value.
 * @returns A new Result containing the mapped value or the original error.
 */
export function map<T, U>(
  result: Result<T>,
  mapper: (value: T) => U
): Result<U> {
  if (result.isErr()) {
    // Access the 'error' property directly since the result is Err
    const errorResult = result as Err<T>;
    return new Err<U>(errorResult.error);
  }

  if (result.isOk()) {
    // Access the 'value' property directly since the result is Ok
    const okResult = result as Ok<T>;
    const mappedValue: U = mapper(okResult.value);
    return new Ok<U>(mappedValue);
  }

  // Optional: Handle unexpected cases
  return new Err<U>("Unknown error in map.");
}