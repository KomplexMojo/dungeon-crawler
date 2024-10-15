import { Ok, Err, Result } from "./Result";

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