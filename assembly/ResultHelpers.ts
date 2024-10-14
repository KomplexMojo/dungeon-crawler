// ResultHelpers.ts

import { Ok, Err, Result, isOkResult, isErrResult } from "./Result";

/**
 * Safely casts a Result<T> to Ok<T> if it's an Ok result.
 * @param result - The Result instance to cast.
 * @returns The Ok<T> instance or null if it's not an Ok result.
 */
export function castOk<T>(result: Result<T>): Ok<T> | null {
    return isOkResult(result) ? <Ok<T>>result : null;
}

/**
 * Safely casts a Result<T> to Err<T> if it's an Err result.
 * @param result - The Result instance to cast.
 * @returns The Err<T> instance or null if it's not an Err result.
 */
export function castErr<T>(result: Result<T>): Err<T> | null {
    return isErrResult(result) ? <Err<T>>result : null;
}