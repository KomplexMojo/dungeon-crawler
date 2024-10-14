// JSONUtils.ts

import { Obj } from "assemblyscript-json/assembly/JSON";
import { Ok, Err, Result, isOkResult, isErrResult } from "./Result";

/**
 * Safely retrieves an unsigned 8-bit integer (u8) from a JSON object.
 * Ensures the value is within the range 0-255.
 *
 * @param obj - The JSON object.
 * @param key - The key to retrieve.
 * @param context - Contextual information for error messages.
 * @returns A Result containing the u8 or an Err with an error message.
 */
export function getSafeU8(
  obj: Obj,
  key: string,
  context: string = ""
): Result<u8> {
  const intVal = obj.getInteger(key);

  if (intVal == null) {
    return new Err<u8>(
      `Key '${key}' is missing or not an integer.${
        context ? ` Context: ${context}` : ""
      }`
    );
  }

  const value: i64 = intVal.valueOf();

  // Check if the value is within the u8 range
  if (value < 0 || value > 255) {
    return new Err<u8>(
      `Value for key '${key}' (${value}) is out of range (0-255).${
        context ? ` Context: ${context}` : ""
      }`
    );
  }

  // Cast the i64 value to u8
  return new Ok<u8>(u8(value));
}

/**
 * Safely retrieves a string from a JSON object.
 * @param obj - The JSON object.
 * @param key - The key to retrieve.
 * @param context - Contextual information for error messages.
 * @returns A Result containing the string or an Err with an error message.
 */
export function getSafeString(
  obj: Obj,
  key: string,
  context: string = ""
): Result<string> {
  const strVal = obj.getString(key);

  if (strVal == null) {
    return new Err<string>(
      `Key '${key}' is missing or not a string.${
        context ? ` Context: ${context}` : ""
      }`
    );
  }

  return new Ok<string>(strVal.valueOf());
}

export function getSafeBoolean(jsonObj: Obj, key: string): Result<bool> {
  const value = jsonObj.getBool(key);
  if (value == null) {
    return new Err<bool>(`${key} not specified in CharacteristicDefinition.`);
  }
  return new Ok<bool>(value.valueOf());
}
