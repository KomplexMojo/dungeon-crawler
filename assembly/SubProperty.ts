// SubProperty.ts

import { JSON } from "assemblyscript-json/assembly";
import { Ok, Err, Result } from "./Result"; // Adjust the path based on your project structure

export class SubProperty {
    value: u8; // Enforced to be within 0-255
    name: string;
    description: string;

    constructor(value: u8, name: string, description: string) {
        this.value = value;
        this.name = name;
        this.description = description;
    }

    /**
     * Factory method to create a SubProperty instance from a JSON object.
     * @param jsonObj - The JSON object representing a SubProperty.
     * @returns A Result containing either a new SubProperty instance or an error message.
     */
    static fromJSON(jsonObj: JSON.Obj | null): Result<SubProperty> {
        if (jsonObj == null) {
            return new Err<SubProperty>("Invalid data for SubProperty: JSON object is null.");
        }

        // Parse 'value'
        const valueObj = jsonObj.getInteger("value");
        if (valueObj == null) {
            return new Err<SubProperty>("Value not specified in SubProperty.");
        }
        const tempValue: i64 = valueObj.valueOf();

        // Validate and cast 'value' from i64 to u8
        const U8_MAX: i64 = 255;
        const U8_MIN: i64 = 0;
        if (tempValue > U8_MAX || tempValue < U8_MIN) {
            return new Err<SubProperty>(
                `Value ${tempValue} out of range for u8 in SubProperty (0-255).`
            );
        }
        const value: u8 = u8(tempValue); // Explicit cast after validation

        // Parse 'name'
        const nameObj = jsonObj.getString("name");
        if (nameObj == null) {
            return new Err<SubProperty>("Name not specified in SubProperty.");
        }
        const name: string = nameObj.valueOf();

        // Parse 'description'
        const descriptionObj = jsonObj.getString("description");
        if (descriptionObj == null) {
            return new Err<SubProperty>("Description not specified in SubProperty.");
        }
        const description: string = descriptionObj.valueOf();

        // Create and return the SubProperty instance wrapped in Ok
        return new Ok<SubProperty>(new SubProperty(value, name, description));
    }
}