// BehaviourDefinition.ts

import { Property } from "./Property";
import { SubProperty } from "./SubProperty";
import { JSON } from "assemblyscript-json/assembly";
import { PropertyTypeIndex } from "./Enumerations";
import { Ok, Err, Result, isOkResult, isErrResult } from "./Result";
import { loadArray } from "./ArrayUtils";
import { castOk, castErr } from "./ResultHelpers";

export class BehaviourDefinitions {
  behaviours: BehaviourDefinition[];

  constructor() {
    this.behaviours = [];
  }

  /**
   * Load all behaviour definitions from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result indicating success or containing an error message.
   */
  loadFromJSON(jsonObj: JSON.Obj): Result<void> {
    const behavioursArr = jsonObj.getArr("behaviours");
    if (behavioursArr != null) {
      const loadResult = loadArray<BehaviourDefinition>(
        behavioursArr,
        (behaviourJson: JSON.Obj) =>
          BehaviourDefinition.fromJSON(behaviourJson),
        "BehaviourDefinitions"
      );

      const errorResult = castErr<BehaviourDefinition[]>(loadResult);
      if (errorResult != null) {
        return new Err<void>(errorResult.error);
      }

      const okResult = castOk<BehaviourDefinition[]>(loadResult);
      if (okResult != null) {
        this.behaviours = okResult.value;
        return new Ok<void>();
      }

      return new Err<void>("Unknown error in loading BehaviourDefinitions.");
    } else {
      return new Err<void>("Invalid data for BehaviourDefinitions.");
    }
  }

  /**
   * Fetch a BehaviourDefinition by index.
   * @param index - The index of the behaviour definition.
   * @returns The corresponding BehaviourDefinition, or null if not found.
   */
  getBehaviourDefinition(index: i32): BehaviourDefinition | null {
    for (let i = 0; i < this.behaviours.length; i++) {
      if (this.behaviours[i].index == index) {
        return this.behaviours[i];
      }
    }
    return null;
  }

  /**
   * Factory method to create a BehaviourDefinitions instance from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result containing the BehaviourDefinitions instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj): Result<BehaviourDefinitions> {
    const behaviourDefinitions = new BehaviourDefinitions();
    const loadResult = behaviourDefinitions.loadFromJSON(jsonObj);

    const errorResult = castErr<void>(loadResult);
    if (errorResult != null) {
      return new Err<BehaviourDefinitions>(errorResult.error);
    }

    const okResult = castOk<void>(loadResult);
    if (okResult != null) {
      return new Ok<BehaviourDefinitions>(behaviourDefinitions);
    }

    return new Err<BehaviourDefinitions>("Unknown error in fromJSON.");
  }
}

// BehaviourDefinition.ts

export class BehaviourDefinition {
  index: i32;
  behaviourName: string;
  description: string;
  required: bool;
  growth: string;
  subProperties: SubProperty[];

  constructor() {
    this.index = 0;
    this.behaviourName = "";
    this.description = "";
    this.required = false;
    this.growth = "fixed";
    this.subProperties = [];
  }

  /**
   * Load a BehaviourDefinition from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result indicating success or containing an error message.
   */
  loadFromJSON(jsonObj: JSON.Obj): Result<void> {
    const indexResult = BehaviourDefinition.getSafeInteger(jsonObj, "index");
    const errorIndexResult = castErr<i32>(indexResult);
    if (errorIndexResult != null) {
      return new Err<void>(errorIndexResult.error);
    }

    const okIndexResult = castOk<i32>(indexResult);
    if (okIndexResult != null) {
      this.index = okIndexResult.value;
    }

    const nameResult = BehaviourDefinition.getSafeString(jsonObj, "name");
    const errorNameResult = castErr<string>(nameResult);
    if (errorNameResult != null) {
      return new Err<void>(errorNameResult.error);
    }

    const okNameResult = castOk<string>(nameResult);
    if (okNameResult != null) {
      this.behaviourName = okNameResult.value;
    }

    const descriptionResult = BehaviourDefinition.getSafeString(
      jsonObj,
      "description"
    );
    const errorDescriptionResult = castErr<string>(descriptionResult);
    if (errorDescriptionResult != null) {
      return new Err<void>(errorDescriptionResult.error);
    }

    const okDescriptionResult = castOk<string>(descriptionResult);
    if (okDescriptionResult != null) {
      this.description = okDescriptionResult.value;
    }

    const propertiesObj = jsonObj.getObj("properties");
    if (propertiesObj != null) {
      const requiredResult = BehaviourDefinition.getSafeBoolean(
        propertiesObj,
        "required"
      );
      const growthResult = BehaviourDefinition.getSafeString(
        propertiesObj,
        "growth"
      );

      const errorRequiredResult = castErr<bool>(requiredResult);
      if (errorRequiredResult != null) {
        return new Err<void>(errorRequiredResult.error);
      }

      const errorGrowthResult = castErr<string>(growthResult);
      if (errorGrowthResult != null) {
        return new Err<void>(errorGrowthResult.error);
      }

      const okRequiredResult = castOk<bool>(requiredResult);
      const okGrowthResult = castOk<string>(growthResult);
      if (okRequiredResult != null && okGrowthResult != null) {
        this.required = okRequiredResult.value;
        this.growth = okGrowthResult.value;
      }
    } else {
      return new Err<void>(
        "Invalid or missing 'properties' object for behaviour definition."
      );
    }

    const subPropertiesArr = jsonObj.getArr("subProperties");
    if (subPropertiesArr != null) {
      const subPropsResult = loadArray<SubProperty>(
        subPropertiesArr,
        (subPropertyJson: JSON.Obj) => SubProperty.fromJSON(subPropertyJson),
        "BehaviourDefinition"
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
   * Factory method to create a BehaviourDefinition instance from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result containing the BehaviourDefinition instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj): Result<BehaviourDefinition> {
    const behaviour = new BehaviourDefinition();
    const loadResult = behaviour.loadFromJSON(jsonObj);

    const errorResult = castErr<void>(loadResult);
    if (errorResult != null) {
      return new Err<BehaviourDefinition>(errorResult.error);
    }

    return new Ok<BehaviourDefinition>(behaviour);
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

  /**
   * Helper method to safely retrieve an integer from a JSON object.
   */
  private static getSafeInteger(jsonObj: JSON.Obj, key: string): Result<i32> {
    const value = jsonObj.getInteger(key);
    if (value == null) {
      return new Err<i32>(`${key} not specified in BehaviourDefinition.`);
    }
    return new Ok<i32>(value.valueOf() as i32);
  }

  /**
   * Helper method to safely retrieve a string from a JSON object.
   */
  private static getSafeString(jsonObj: JSON.Obj, key: string): Result<string> {
    const value = jsonObj.getString(key);
    if (value == null) {
      return new Err<string>(`${key} not specified in BehaviourDefinition.`);
    }
    return new Ok<string>(value.valueOf());
  }

  /**
   * Helper method to safely retrieve a boolean from a JSON object.
   */
  private static getSafeBoolean(jsonObj: JSON.Obj, key: string): Result<bool> {
    const value = jsonObj.getBool(key);
    if (value == null) {
      return new Err<bool>(`${key} not specified in BehaviourDefinition.`);
    }
    return new Ok<bool>(value.valueOf());
  }
}

// Behaviour.ts

export class Behaviour {
  property: Property;
  definition: BehaviourDefinition;

  constructor(property: Property, definition: BehaviourDefinition) {
    this.property = property;
    this.definition = definition;
  }

  /**
   * Load an array of Behaviour instances from a JSON object.
   * @param jsonObj - The JSON object.
   * @param definitions - The BehaviourDefinitions instance.
   * @returns A Result containing the array of Behaviour instances or an error message.
   */
  static fromJSON(
    jsonObj: JSON.Obj,
    definitions: BehaviourDefinitions
  ): Result<Behaviour[]> {
    const behavioursArr = jsonObj.getArr("behaviours");
    if (behavioursArr == null) {
      return new Err<Behaviour[]>("Invalid behaviours data.");
    }

    const behaviours = new Array<Behaviour>();
    const behavioursArray = behavioursArr.valueOf();

    for (let i = 0; i < behavioursArray.length; i++) {
      const behValue = behavioursArray[i];
      if (behValue.isObj) {
        const behObj = <JSON.Obj>behValue;

        const indexResult = Behaviour.getSafeInteger(behObj, "index");
        const errorIndexResult = castErr<i32>(indexResult);
        if (errorIndexResult != null) {
          return new Err<Behaviour[]>(errorIndexResult.error);
        }

        const okIndexResult = castOk<i32>(indexResult);
        if (okIndexResult != null) {
          const index = <u8>okIndexResult.value;

          const definition = definitions.getBehaviourDefinition(index);
          if (definition == null) {
            return new Err<Behaviour[]>(
              `BehaviourDefinition with index ${index} not found.`
            );
          }

          const extractedValuesResult = Behaviour.extractValuesFromJSON(
            behObj,
            definition,
            index
          );
          const errorExtractedValuesResult = castErr<ExtractedBehaviourValues>(
            extractedValuesResult
          );
          if (errorExtractedValuesResult != null) {
            return new Err<Behaviour[]>(errorExtractedValuesResult.error);
          }

          const okExtractedValuesResult = castOk<ExtractedBehaviourValues>(
            extractedValuesResult
          );
          if (okExtractedValuesResult != null) {
            const extractedValues = okExtractedValuesResult.value;

            const property = new Property(
              index,
              extractedValues.currentValue,
              extractedValues.maximumValue,
              PropertyTypeIndex.Behaviour,
              extractedValues.subProperty
            );

            const behaviour = new Behaviour(property, definition);
            behaviours.push(behaviour);
          }
        }
      } else {
        return new Err<Behaviour[]>("Invalid behaviour data.");
      }
    }

    return new Ok<Behaviour[]>(behaviours);
  }

  /**
   * Helper method to extract values from a JSON object.
   */
  private static extractValuesFromJSON(
    jsonObj: JSON.Obj,
    definition: BehaviourDefinition,
    index: u8
  ): Result<ExtractedBehaviourValues> {
    let currentValue: u8 = 0;
    let maximumValue: u8 = 0;
    let subProperty: SubProperty | null = null;

    if (definition.subProperties.length > 0) {
      const subPropValueResult = Behaviour.getSafeInteger(
        jsonObj,
        "currentValue"
      );
      const errorSubPropValueResult = castErr<i32>(subPropValueResult);
      if (errorSubPropValueResult != null) {
        return new Err<ExtractedBehaviourValues>(errorSubPropValueResult.error);
      }

      const okSubPropValueResult = castOk<i32>(subPropValueResult);
      if (okSubPropValueResult != null) {
        const subPropValue = <u8>okSubPropValueResult.value;
        currentValue = subPropValue;
        maximumValue = subPropValue;

        subProperty = definition.getSubPropertyByValue(subPropValue);
        if (subProperty == null) {
          return new Err<ExtractedBehaviourValues>(
            `SubProperty with value ${subPropValue} not found for behaviour index ${index}.`
          );
        }
      }
    } else {
      const currentValueResult = Behaviour.getSafeInteger(
        jsonObj,
        "currentValue"
      );
      const maximumValueResult = Behaviour.getSafeInteger(
        jsonObj,
        "maximumValue"
      );

      const errorCurrentValueResult = castErr<i32>(currentValueResult);
      if (errorCurrentValueResult != null) {
        return new Err<ExtractedBehaviourValues>(errorCurrentValueResult.error);
      }

      const errorMaximumValueResult = castErr<i32>(maximumValueResult);
      if (errorMaximumValueResult != null) {
        return new Err<ExtractedBehaviourValues>(errorMaximumValueResult.error);
      }

      const okCurrentValueResult = castOk<i32>(currentValueResult);
      const okMaximumValueResult = castOk<i32>(maximumValueResult);

      if (okCurrentValueResult != null && okMaximumValueResult != null) {
        currentValue = <u8>okCurrentValueResult.value;
        maximumValue = <u8>okMaximumValueResult.value;
      }
    }

    return new Ok<ExtractedBehaviourValues>(
      new ExtractedBehaviourValues(currentValue, maximumValue, subProperty)
    );
  }

  /**
   * Helper method to safely retrieve an integer from a JSON object.
   */
  private static getSafeInteger(jsonObj: JSON.Obj, key: string): Result<i32> {
    const value = jsonObj.getInteger(key);
    if (value == null) {
      return new Err<i32>(`${key} not specified for behaviour.`);
    }
    return new Ok<i32>(value.valueOf());
  }
}

// Class to hold extracted values
class ExtractedBehaviourValues {
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
