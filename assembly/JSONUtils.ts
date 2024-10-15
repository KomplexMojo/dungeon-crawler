// JSONUtils.ts

import { JSON } from "assemblyscript-json/assembly";
import { Ok, Err, Result } from "./Result";

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
  obj: JSON.Obj,
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
  obj: JSON.Obj,
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

/**
 * Safely retrieves a boolean from a JSON object.
 * @param jsonObj - The JSON object.
 * @param key - The key to retrieve.
 * @returns A Result containing the boolean or an Err with an error message.
 */
export function getSafeBoolean(jsonObj: JSON.Obj, key: string): Result<bool> {
  const value = jsonObj.getBool(key);
  if (value == null) {
    return new Err<bool>(`Key '${key}' is missing or not a boolean.`);
  }
  return new Ok<bool>(value.valueOf());
}


/**
 * Parses a 2D array of booleans from a JSON array.
 * @param arr - The JSON array representing the 2D boolean array.
 * @returns A Result containing the 2D boolean array or an error message.
 */
export function parseBool2DArray(arr: JSON.Arr): Result<bool[][]> {
  let result: bool[][] = [];

  // Retrieve the underlying Array<Value>
  let outerValues = arr.valueOf();

  for (let i: i32 = 0; i < outerValues.length; i++) {
    let rowValue = outerValues[i];

    // Check if the row is an array
    if (!rowValue.isArr) {
      return new Err<bool[][]>(
        `Row ${i} is not a valid array in 'visualization'.`
      );
    }

    let rowArr = rowValue as JSON.Arr;
    let innerValues = rowArr.valueOf();
    let boolRow: bool[] = [];

    for (let j: i32 = 0; j < innerValues.length; j++) {
      let cellValue = innerValues[j];

      // Check if the cell is a boolean
      if (!cellValue.isBool) {
        return new Err<bool[][]>(
          `Value at (${i}, ${j}) is not a valid boolean in 'visualization'.`
        );
      }

      let boolVal = <JSON.Bool>cellValue;
      boolRow.push(boolVal.valueOf());
    }

    result.push(boolRow);
  }

  return new Ok<bool[][]>(result);
}
