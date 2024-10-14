// CharacteristicDefinition.ts

import { SubProperty } from "./SubProperty";
import { JSON } from "assemblyscript-json/assembly";
import { Property } from "./Property";
import { PropertyTypeIndex } from "./Enumerations";
import { Ok, Err, Result, isOkResult, isErrResult } from "./Result";
import { loadArray } from "./ArrayUtils";
import { getSafeU8, getSafeString } from "./JSONUtils";
import { castOk, castErr } from "./ResultHelpers";

export class CharacteristicDefinition {
  characteristicName: string;
  required: bool;
  capabilities: u8;
  subProperties: SubProperty[];

  constructor() {
    this.characteristicName = "";
    this.required = false;
    this.capabilities = 0;
    this.subProperties = [];
  }

  /**
   * Load a CharacteristicDefinition from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result indicating success or containing an error message.
   */
  loadFromJSON(jsonObj: JSON.Obj): Result<void> {
    const indexResult = getSafeU8(jsonObj, "index", "CharacteristicDefinition");
    const errorIndexResult = castErr<u8>(indexResult);
    if (errorIndexResult != null) {
      return new Err<void>(errorIndexResult.error);
    }

    const nameResult = getSafeString(
      jsonObj,
      "name",
      "CharacteristicDefinition"
    );
    const errorNameResult = castErr<string>(nameResult);
    if (errorNameResult != null) {
      return new Err<void>(errorNameResult.error);
    }

    const descriptionResult = getSafeString(
      jsonObj,
      "description",
      "CharacteristicDefinition"
    );
    const errorDescriptionResult = castErr<string>(descriptionResult);
    if (errorDescriptionResult != null) {
      return new Err<void>(errorDescriptionResult.error);
    }

    const requiredResult = CharacteristicDefinition.getSafeBoolean(
      jsonObj,
      "required"
    );
    const errorRequiredResult = castErr<bool>(requiredResult);
    if (errorRequiredResult != null) {
      return new Err<void>(errorRequiredResult.error);
    }

    const capabilitiesResult = getSafeU8(
      jsonObj,
      "capabilities",
      "CharacteristicDefinition"
    );
    const errorCapabilitiesResult = castErr<u8>(capabilitiesResult);
    if (errorCapabilitiesResult != null) {
      return new Err<void>(errorCapabilitiesResult.error);
    }

    const subPropertiesArr = jsonObj.getArr("subProperties");
    if (subPropertiesArr != null) {
      const subPropsResult = loadArray<SubProperty>(
        subPropertiesArr,
        (subPropertyJson: JSON.Obj) => SubProperty.fromJSON(subPropertyJson),
        "CharacteristicDefinition"
      );

      const errorSubPropsResult = castErr<SubProperty[]>(subPropsResult);
      if (errorSubPropsResult != null) {
        return new Err<void>(errorSubPropsResult.error);
      }

      const okSubPropsResult = castOk<SubProperty[]>(subPropsResult);
      if (okSubPropsResult != null) {
        this.subProperties = okSubPropsResult.value;
      }
    } else {
      this.subProperties = [];
    }

    return new Ok<void>();
  }

  /**
   * Factory method to create a CharacteristicDefinition from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result containing the CharacteristicDefinition instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj): Result<CharacteristicDefinition> {
    const characteristic = new CharacteristicDefinition();
    const loadResult = characteristic.loadFromJSON(jsonObj);

    const errorResult = castErr<void>(loadResult);
    if (errorResult != null) {
      return new Err<CharacteristicDefinition>(errorResult.error);
    }

    return new Ok<CharacteristicDefinition>(characteristic);
  }

  /**
   * Method to find a sub-property by its value.
   * @param value - The value to search for.
   * @returns The corresponding SubProperty, or null if not found.
   */
  getSubPropertyByValue(value: u8): SubProperty | null {
    for (let i = 0; i < this.subProperties.length; i++) {
      if (this.subProperties[i].value == value) {
        return this.subProperties[i];
      }
    }
    return null;
  }
}

export class CharacteristicDefinitions {
  characteristics: CharacteristicDefinition[];

  constructor() {
    this.characteristics = [];
  }

  /**
   * Load all characteristic definitions from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result indicating success or containing an error message.
   */
  loadFromJSON(jsonObj: JSON.Obj): Result<void> {
    const characteristicsArr = jsonObj.getArr("characteristics");
    if (characteristicsArr != null) {
      const loadResult = loadArray<CharacteristicDefinition>(
        characteristicsArr,
        (charJson: JSON.Obj) => CharacteristicDefinition.fromJSON(charJson),
        "CharacteristicDefinitions"
      );

      const errorResult = castErr<CharacteristicDefinition[]>(loadResult);
      if (errorResult != null) {
        return new Err<void>(errorResult.error);
      }

      const okResult = castOk<CharacteristicDefinition[]>(loadResult);
      if (okResult != null) {
        this.characteristics = okResult.value;
        return new Ok<void>();
      }

      return new Err<void>(
        "Unknown error in loading CharacteristicDefinitions."
      );
    } else {
      return new Err<void>("Invalid data for CharacteristicDefinitions.");
    }
  }

  /**
   * Factory method to create a CharacteristicDefinitions instance from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result containing the CharacteristicDefinitions instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj): Result<CharacteristicDefinitions> {
    const definitions = new CharacteristicDefinitions();
    const loadResult = definitions.loadFromJSON(jsonObj);

    const errorResult = castErr<void>(loadResult);
    if (errorResult != null) {
      return new Err<CharacteristicDefinitions>(errorResult.error);
    }

    return new Ok<CharacteristicDefinitions>(definitions);
  }

  /**
   * Fetch a characteristic definition by index.
   * @param index - The index of the characteristic definition.
   * @returns The corresponding CharacteristicDefinition, or null if not found.
   */
  getCharacteristicDefinition(index: u8): CharacteristicDefinition | null {
    for (let i = 0; i < this.characteristics.length; i++) {
      if (this.characteristics[i].index == index) {
        return this.characteristics[i];
      }
    }
    return null;
  }
}

// Characteristic.ts

export class Characteristic {
  property: Property;
  definition: CharacteristicDefinition;

  constructor(property: Property, definition: CharacteristicDefinition) {
    this.property = property;
    this.definition = definition;
  }

  /**
   * Load an array of Characteristic instances from a JSON object.
   * @param jsonObj - The JSON object.
   * @param definitions - The CharacteristicDefinitions instance.
   * @returns A Result containing the array of Characteristic instances or an error message.
   */
  static fromJSON(
    jsonObj: JSON.Obj,
    definitions: CharacteristicDefinitions
  ): Result<Characteristic[]> {
    const characteristicsArr = jsonObj.getArr("characteristics");
    if (characteristicsArr == null) {
      return new Err<Characteristic[]>("Invalid characteristics data.");
    }

    const characteristics = new Array<Characteristic>();
    const characteristicsArray = characteristicsArr.valueOf();

    for (let i = 0; i < characteristicsArray.length; i++) {
      const charValue = characteristicsArray[i];
      if (charValue.isObj) {
        const charObj = <JSON.Obj>charValue;

        const indexResult = getSafeU8(charObj, "index", "Characteristic");
        const errorIndexResult = castErr<u8>(indexResult);
        if (errorIndexResult != null) {
          return new Err<Characteristic[]>(errorIndexResult.error);
        }

        const okIndexResult = castOk<u8>(indexResult);
        if (okIndexResult != null) {
          const index = okIndexResult.value;

          // Get the definition for the characteristic
          const definition = definitions.getCharacteristicDefinition(index);
          if (definition == null) {
            return new Err<Characteristic[]>(
              `CharacteristicDefinition with index ${index} not found.`
            );
          }

          // Extract the currentValue, maximumValue, and subProperty
          const extractedValuesResult = Characteristic.extractValuesFromJSON(
            charObj,
            definition,
            index
          );
          const errorExtractedValuesResult = castErr<ExtractedValues>(
            extractedValuesResult
          );
          if (errorExtractedValuesResult != null) {
            return new Err<Characteristic[]>(errorExtractedValuesResult.error);
          }

          const okExtractedValuesResult = castOk<ExtractedValues>(
            extractedValuesResult
          );
          if (okExtractedValuesResult != null) {
            const extractedValues = okExtractedValuesResult.value;

            const property = new Property(
              index,
              extractedValues.currentValue,
              extractedValues.maximumValue,
              PropertyTypeIndex.Characteristic,
              extractedValues.subProperty
            );

            const characteristic = new Characteristic(property, definition);
            characteristics.push(characteristic);
          }
        }
      } else {
        return new Err<Characteristic[]>("Invalid Characteristic data.");
      }
    }

    return new Ok<Characteristic[]>(characteristics);
  }

  /**
   * Helper method to extract currentValue, maximumValue, and subProperty from a JSON object.
   */
  private static extractValuesFromJSON(
    jsonObj: JSON.Obj,
    definition: CharacteristicDefinition,
    index: u8
  ): Result<ExtractedValues> {
    let currentValue: u8 = 0;
    let maximumValue: u8 = 0;
    let subProperty: SubProperty | null = null;

    if (definition.subProperties.length > 0) {
      const subPropValueResult = getSafeU8(
        jsonObj,
        "currentValue",
        "Characteristic"
      );
      const errorSubPropValueResult = castErr<u8>(subPropValueResult);
      if (errorSubPropValueResult != null) {
        return new Err<ExtractedValues>(errorSubPropValueResult.error);
      }

      const okSubPropValueResult = castOk<u8>(subPropValueResult);
      if (okSubPropValueResult != null) {
        const subPropValue = okSubPropValueResult.value;
        currentValue = subPropValue;
        maximumValue = subPropValue;

        subProperty = definition.getSubPropertyByValue(subPropValue);
        if (subProperty == null) {
          return new Err<ExtractedValues>(
            `SubProperty with value ${subPropValue} not found for characteristic index ${index}.`
          );
        }
      }
    } else {
      const currentValueResult = getSafeU8(
        jsonObj,
        "currentValue",
        "Characteristic"
      );
      const maximumValueResult = getSafeU8(
        jsonObj,
        "maximumValue",
        "Characteristic"
      );

      const errorCurrentValueResult = castErr<u8>(currentValueResult);
      if (errorCurrentValueResult != null) {
        return new Err<ExtractedValues>(errorCurrentValueResult.error);
      }

      const errorMaximumValueResult = castErr<u8>(maximumValueResult);
      if (errorMaximumValueResult != null) {
        return new Err<ExtractedValues>(errorMaximumValueResult.error);
      }

      const okCurrentValueResult = castOk<u8>(currentValueResult);
      const okMaximumValueResult = castOk<u8>(maximumValueResult);

      if (okCurrentValueResult != null && okMaximumValueResult != null) {
        currentValue = okCurrentValueResult.value;
        maximumValue = okMaximumValueResult.value;
      }
    }

    return new Ok<ExtractedValues>(
      new ExtractedValues(currentValue, maximumValue, subProperty)
    );
  }
}

// Class to hold extracted values
class ExtractedValues {
  currentValue: u8;
  maximumValue: u8;
  subProperty: SubProperty | null;

  constructor(
    currentValue: u8,
    maximumValue: u8,
    subProperty: SubProperty | null
  ) {
    this.currentValue = currentValue;
    this.maximumValue = maximumValue;
    this.subProperty = subProperty;
  }
}
