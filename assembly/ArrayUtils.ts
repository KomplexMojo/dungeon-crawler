// ArrayUtils.ts

import { Value, Obj, Arr } from "assemblyscript-json/assembly/JSON"; // Adjust the import based on your file structure
import { Ok, Err, Result, isOkResult, isErrResult } from "./Result";

/**
 * Loads an array of objects from a JSON array using a provided parser function.
 * @param jsonArr - The JSON array.
 * @param parser - The function to parse each Obj.
 * @param context - Optional context for error messages.
 * @returns A Result containing the array of parsed objects or an error message.
 */
export function loadArray<T>(
  jsonArr: Arr,
  parser: (item: Obj) => Result<T>,
  context: string = ""
): Result<T[]> {
  const items = jsonArr.valueOf();
  const resultArray = new Array<T>();

  for (let i = 0; i < items.length; i++) {
    const item: Value =  items[i];

    // Check if the item is an object
    if (!item.isObj) {
      return new Err<T[]>(
        `Invalid item at index ${i} in array.${context ? ` Context: ${context}` : ""}`
      );
    }

    // Safe casting using 'instanceof'
    if (item instanceof Obj) {
      const obj = <Obj>item;
      const parsedResult = parser(obj);

      // Check if parsing resulted in an error
      if (isErrResult(parsedResult)) {
        // Explicitly cast parsedResult to Err<T> to access 'error'
        const errorResult = <Err<T>>parsedResult;
        return new Err<T[]>(
          `Error parsing item at index ${i}: ${errorResult.error}`
        );
      }

      // Check if parsing is successful
      if (isOkResult(parsedResult)) {
        // Explicitly cast parsedResult to Ok<T> to access 'value'
        const okResult = <Ok<T>>parsedResult;
        resultArray.push(okResult.value);
      }
    } else {
      // This block should theoretically never be reached due to the 'isObj' check
      return new Err<T[]>(
        `Item at index ${i} is marked as object but is not an instance of Obj.${context ? ` Context: ${context}` : ""}`
      );
    }
  }

  // If all items are parsed successfully, return the array wrapped in Ok
  return new Ok<T[]>(resultArray);
}