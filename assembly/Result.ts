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