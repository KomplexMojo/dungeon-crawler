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
 * Represents an error result containing an error message.
 */
export class Err<T = any> extends Result<T> {
  // Making Err generic for consistency
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
 * Type guard to check if Result is Ok.
 * @param result - The Result instance to check.
 * @returns True if Result is Ok, false otherwise.
 */
export function isOkResult<T>(result: Result<T>): bool {
  return result instanceof Ok;
}

/**
 * Type guard to check if Result is Err.
 * @param result - The Result instance to check.
 * @returns True if Result is Err, false otherwise.
 */
export function isErrResult<T>(result: Result<T>): bool {
  return result instanceof Err;
}
