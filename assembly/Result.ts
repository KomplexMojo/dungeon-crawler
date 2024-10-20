// Result.ts

/**
 * Abstract base class for Result.
 * Serves as a common type for Ok and Err.
 */
export abstract class Result<T> {
  /**
   * Indicates whether the result is successful.
   * Implemented by subclasses.
   */
  abstract isOk(): bool;

  /**
   * Indicates whether the result is an error.
   * Implemented by subclasses.
   */
  isErr(): bool {
    return !this.isOk(); // If it's not Ok, it must be an error
  }
}

/**
 * Represents a successful result containing a value of type T.
 */
export class Ok<T> extends Result<T> {
  readonly value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  /**
   * Always returns true for Ok.
   */
  isOk(): bool {
    return true;
  }
}

/**
 * Represents a successful result with no value (void).
 */
export class OkVoid extends Result<void> {
  /**
   * Constructor for OkVoid.
   */
  constructor() {
    super();
  }

  /**
   * Always returns true for OkVoid.
   */
  isOk(): bool {
    return true;
  }
}

/**
 * Represents an error result containing an error message.
 */
export class Err<T = any> extends Result<T> {
  readonly error: string;

  constructor(error: string) {
    super();
    this.error = error;
  }

  /**
   * Always returns false for Err.
   */
  isOk(): bool {
    return false;
  }
}

/**
 * Safely casts a Result<T> to Ok<T> if it's an Ok result.
 * @param result - The Result instance to cast.
 * @returns The Ok<T> instance or null if it's not an Ok result.
 */
export function castOk<T>(result: Result<T>): Ok<T> | null {
  if (result instanceof Ok) {
    return result as Ok<T>;
  }
  return null;
}

/**
 * Safely casts a Result<T> to Err<T> if it's an Err result.
 * @param result - The Result instance to cast.
 * @returns The Err<T> instance or null if it's not an Err result.
 */
export function castErr<T>(result: Result<T>): Err<T> | null {
  if (result instanceof Err) {
    return result as Err<T>;
  }
  return null;
}

/**
 * Checks whether the result is an Ok result.
 * @param result - The Result instance to check.
 * @returns true if the result is an Ok result, false otherwise.
 */
export function isOkResult<T>(result: Result<T>): bool {
    return result instanceof Ok;
}

/**
 * Checks whether the result is an Err result.
 * @param result - The Result instance to check.
 * @returns true if the result is an Err result, false otherwise.
 */
export function isErrResult<T>(result: Result<T>): bool {
    return result instanceof Err;
}

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