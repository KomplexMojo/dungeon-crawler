// ArrayUtils.ts

import { JSON } from "assemblyscript-json/assembly";
import { Result, Ok, Err } from "./Result";
import { castOk, castErr } from "./castHelpers";

/**
 * Generic function to load an array of items from a JSON array.
 * @param arr - The JSON array (`JSON.Arr`).
 * @param parser - A function that parses each JSON object (`JSON.Obj`) into an item of type T.
 * @param context - Context string for error messages.
 * @returns A `Result` containing either the array of items (`T[]`) or an error message (`Err`).
 */
export function loadArray<T>(
  arr: JSON.Arr,
  parser: (itemJson: JSON.Obj) => Result<T>,
  context: string
): Result<T[]> {
  let result: T[] = [];

  // Retrieve the underlying Array<Value>
  let values = arr.valueOf();

  for (let i: i32 = 0; i < values.length; i++) {
    let jsonValue = values[i];

    // Check if the Value is a JSON object
    if (!jsonValue.isObj) {
      return new Err<T[]>(
        `${context}: Item at index ${i} is not a valid JSON object.`
      );
    }

    // Cast the Value to JSON.Obj
    let itemObj = jsonValue as JSON.Obj;

    // Parse the JSON.Obj using the provided parser function
    let parsedResult = parser(itemObj);

    // If parsing resulted in an error, propagate the error with context
    if (castErr<T>(parsedResult) != null) {
      return new Err<T[]>(
        `${context}: Item at index ${i} failed to parse. Error: ${(parsedResult as Err<T>).error}`
      );
    }

    // Extract the successful value and add it to the result array
    let okResult = castOk<T>(parsedResult);
    if (okResult == null) {
      return new Err<T[]>(
        `${context}: Unexpected error extracting value from parsed result at index ${i}.`
      );
    }

    result.push(okResult.value);
  }

  // All items parsed successfully
  return new Ok<T[]>(result);
}