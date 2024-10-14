// ResultUtils.ts

import { Ok, Err, Result, isOkResult, isErrResult } from "./Result";

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
  if (isErrResult(first)) {
    // Cast first to Err<T> to access the 'error' property
    const errorResult = <Err<T>>first;
    return new Err<U>(errorResult.error);
  }

  if (isOkResult(first)) {
    // Cast first to Ok<T> to access the 'value' property
    const okResult = <Ok<T>>first;
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
  if (isErrResult(result)) {
    // Cast result to Err<T> to access the 'error' property
    const errorResult = <Err<T>>result;
    return new Err<U>(errorResult.error);
  }

  if (isOkResult(result)) {
    // Cast result to Ok<T> to access the 'value' property
    const okResult = <Ok<T>>result;
    const mappedValue: U = mapper(okResult.value);
    return new Ok<U>(mappedValue);
  }

  // Optional: Handle unexpected cases
  return new Err<U>("Unknown error in map.");
}