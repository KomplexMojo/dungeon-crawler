// PixelDataUtils.ts

import { JSON } from "assemblyscript-json/assembly";
import { Ok, Err, Result } from "./Result";

/**
 * Parses pixel data from a JSON array.
 * @param pixelDataArr - The JSON array representing pixel data.
 * @returns A Result containing the parsed boolean 2D array or an error message.
 */
export function parsePixelData(pixelDataArr: JSON.Arr): Result<bool[][]> {
  const pixelData = new Array<Array<bool>>();
  const rows = pixelDataArr.valueOf();

  for (let i = 0; i < rows.length; i++) {
    const rowValue = rows[i];
    if (!rowValue.isArr) {
      return new Err<bool[][]>(
        `Invalid row at index ${i} in pixelData; expected an array.`
      );
    }

    const rowArray = (<JSON.Arr>rowValue).valueOf();
    const row = new Array<bool>();

    for (let j = 0; j < rowArray.length; j++) {
      const numValue = rowArray[j];
      if (!numValue.isInteger) {
        return new Err<bool[][]>(
          `Invalid number value at row ${i}, column ${j} in pixelData; expected an integer.`
        );
      }

      const num = (<JSON.Integer>numValue).valueOf();
      if (num === 0) {
        row.push(false);
      } else if (num === 1) {
        row.push(true);
      } else {
        return new Err<bool[][]>(
          `Invalid boolean value in pixelData at row ${i}, column ${j} (expected 0 or 1).`
        );
      }
    }

    pixelData.push(row);
  }

  return new Ok<bool[][]>(pixelData);
}