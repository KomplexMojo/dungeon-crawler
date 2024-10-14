// AppearanceDefinitions.ts

// AppearanceDefinitions.ts

import { JSON } from "assemblyscript-json/assembly";
import { Ok, Err, Result, isOkResult, isErrResult } from "./Result";
import { loadArray } from "./ArrayUtils";
import { getSafeU8, getSafeString } from "./JSONUtils";
import { SubProperty } from "./SubProperty";
import { parsePixelData } from "./PixelDataUtils";
import { Property } from "./Property";
import { castOk, castErr } from "./ResultHelpers"; 
import { PropertyTypeIndex, GrowthTypeIndex } from "./Enumerations"; 

// ---------------------------------------------
// AppearanceDefinitions Class
// ---------------------------------------------

export class AppearanceDefinitions {
  appearances: AppearanceDefinition[];

  constructor() {
    this.appearances = [];
  }

  /**
   * Loads appearances from a JSON object.
   * @param jsonObj - The JSON object containing appearances.
   * @returns A Result indicating success or containing an error message.
   */
  loadFromJSON(jsonObj: JSON.Obj | null): Result<void> {
    if (jsonObj == null) {
      return new Err<void>(
        "Invalid data for AppearanceDefinitions: JSON object is null."
      );
    }

    const appearancesValue = jsonObj.getArr("appearances");
    if (appearancesValue == null) {
      return new Err<void>(
        "Appearances array not specified in AppearanceDefinitions."
      );
    }

    const loadResult = loadArray<AppearanceDefinition>(
      appearancesValue,
      (appJson: JSON.Obj) => AppearanceDefinition.fromJSON(appJson),
      "AppearanceDefinitions"
    );

    const errorResult = castErr<AppearanceDefinition[]>(loadResult);
    if (errorResult != null) {
      return new Err<void>(errorResult.error);
    }

    const okResult = castOk<AppearanceDefinition[]>(loadResult);
    if (okResult != null) {
      this.appearances = okResult.value;
      return new Ok<void>(); // Removed 'null'
    }

    // Optional: Handle unexpected cases
    return new Err<void>("Unknown error in loadFromJSON.");
  }

  /**
   * Factory method to create AppearanceDefinitions from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result containing either the AppearanceDefinitions instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<AppearanceDefinitions> {
    if (jsonObj == null) {
      return new Err<AppearanceDefinitions>(
        "Invalid data: JSON object is null."
      );
    }

    const appearanceDefinitions = new AppearanceDefinitions();
    const loadResult = appearanceDefinitions.loadFromJSON(jsonObj);

    const errorResult = castErr<void>(loadResult);
    if (errorResult != null) {
      return new Err<AppearanceDefinitions>(errorResult.error);
    }

    const okResult = castOk<void>(loadResult);
    if (okResult != null) {
      return new Ok<AppearanceDefinitions>(appearanceDefinitions);
    }

    // Optional: Handle unexpected cases
    return new Err<AppearanceDefinitions>("Unknown error in fromJSON.");
  }

  /**
   * Retrieves an AppearanceDefinition by its index.
   * @param index - The index of the appearance definition.
   * @returns The corresponding AppearanceDefinition, or null if not found.
   */
  getAppearanceDefinition(index: i32): AppearanceDefinition | null {
    for (let i = 0; i < this.appearances.length; i++) {
      if (this.appearances[i].index == index) {
        return this.appearances[i];
      }
    }
    return null;
  }
}

// ---------------------------------------------
// AppearanceDefinition Class
// ---------------------------------------------

export class AppearanceDefinition {
  index: u8;
  name: string;
  description: string;
  pixelData: bool[][];
  subProperties: SubProperty[] | null;

  constructor() {
    this.index = 0;
    this.name = "";
    this.description = "";
    this.pixelData = [];
    this.subProperties = null;
  }

  /**
   * Loads the AppearanceDefinition from a JSON object.
   * @param jsonObj - The JSON object representing an AppearanceDefinition.
   * @returns A Result indicating success or containing an error message.
   */
  loadFromJSON(jsonObj: JSON.Obj | null): Result<void> {
    if (jsonObj == null) {
      return new Err<void>(
        "Invalid data for AppearanceDefinition: JSON object is null."
      );
    }

    // Parse 'spriteTypeIndex'
    const spriteTypeResult = getSafeU8(
      jsonObj,
      "spriteTypeIndex",
      "AppearanceDefinition"
    );
    const errorSpriteResult = castErr<u8>(spriteTypeResult);
    if (errorSpriteResult != null) {
      return new Err<void>(errorSpriteResult.error);
    }

    const okSpriteResult = castOk<u8>(spriteTypeResult);
    if (okSpriteResult == null) {
      return new Err<void>("Unexpected error parsing 'spriteTypeIndex'.");
    }
    this.index = okSpriteResult.value; // Direct assignment

    // Parse 'name'
    const nameResult = getSafeString(jsonObj, "name", "AppearanceDefinition");
    const errorNameResult = castErr<string>(nameResult);
    if (errorNameResult != null) {
      return new Err<void>(errorNameResult.error);
    }

    const okNameResult = castOk<string>(nameResult);
    if (okNameResult == null) {
      return new Err<void>("Unexpected error parsing 'name'.");
    }
    this.name = okNameResult.value;

    // Parse 'description'
    const descriptionResult = getSafeString(
      jsonObj,
      "description",
      "AppearanceDefinition"
    );
    const errorDescriptionResult = castErr<string>(descriptionResult);
    if (errorDescriptionResult != null) {
      return new Err<void>(errorDescriptionResult.error);
    }

    const okDescriptionResult = castOk<string>(descriptionResult);
    if (okDescriptionResult == null) {
      return new Err<void>("Unexpected error parsing 'description'.");
    }
    this.description = okDescriptionResult.value;

    // Parse 'pixelData'
    const pixelDataValue = jsonObj.getArr("pixelData");
    if (pixelDataValue == null) {
      return new Err<void>("pixelData not specified in AppearanceDefinition.");
    }

    const pixelDataResult = parsePixelData(pixelDataValue);
    const errorPixelDataResult = castErr<bool[][]>(pixelDataResult);
    if (errorPixelDataResult != null) {
      return new Err<void>(errorPixelDataResult.error);
    }

    const okPixelDataResult = castOk<bool[][]>(pixelDataResult);
    if (okPixelDataResult == null) {
      return new Err<void>("Unexpected error parsing 'pixelData'.");
    }
    this.pixelData = okPixelDataResult.value;

    // Parse 'subProperties' if applicable
    const subPropertiesArr = jsonObj.getArr("subProperties");
    if (subPropertiesArr != null) {
      const subPropsResult = loadArray<SubProperty>(
        subPropertiesArr,
        (subPropJson: JSON.Obj) => SubProperty.fromJSON(subPropJson),
        "AppearanceDefinition"
      );

      const errorSubPropsResult = castErr<SubProperty[]>(subPropsResult);
      if (errorSubPropsResult != null) {
        return new Err<void>(errorSubPropsResult.error);
      }

      const okSubPropsResult = castOk<SubProperty[]>(subPropsResult);
      if (okSubPropsResult == null) {
        return new Err<void>("Unexpected error parsing 'subProperties'.");
      }
      this.subProperties = okSubPropsResult.value;
    } else {
      this.subProperties = null;
    }

    return new Ok<void>(); // Removed 'null'
  }

  /**
   * Factory method to create an AppearanceDefinition from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result containing either the AppearanceDefinition instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<AppearanceDefinition> {
    if (jsonObj == null) {
      return new Err<AppearanceDefinition>(
        "Invalid data: JSON object is null."
      );
    }

    const appearanceDefinition = new AppearanceDefinition();
    const loadResult = appearanceDefinition.loadFromJSON(jsonObj);

    const errorResult = castErr<void>(loadResult);
    if (errorResult != null) {
      return new Err<AppearanceDefinition>(errorResult.error);
    }

    const okResult = castOk<void>(loadResult);
    if (okResult != null) {
      return new Ok<AppearanceDefinition>(appearanceDefinition);
    }

    // Optional: Handle unexpected cases
    return new Err<AppearanceDefinition>("Unknown error in fromJSON.");
  }

  /**
   * Finds a SubProperty by its value.
   * @param value - The value to search for.
   * @returns The corresponding SubProperty, or null if not found.
   */
  getSubPropertyByValue(value: u8): SubProperty | null {
    if (this.subProperties != null) {
      for (let i = 0; i < this.subProperties.length; i++) {
        if (this.subProperties[i].value == value) {
          return this.subProperties[i];
        }
      }
    }
    return null;
  }
}



// ---------------------------------------------
// Appearance Class
// ---------------------------------------------

export class Appearance {
  property: Property;
  definition: AppearanceDefinition;

  constructor(property: Property, definition: AppearanceDefinition) {
    this.property = property;
    this.definition = definition;
  }

  /**
   * Factory method to create an Appearance instance from a JSON object.
   * @param jsonObj - The JSON object representing an Appearance.
   * @param definitions - The AppearanceDefinitions instance.
   * @returns A Result containing either the Appearance instance or an error message.
   */
  static fromJSON(
    jsonObj: JSON.Obj | null,
    definitions: AppearanceDefinitions | null
  ): Result<Appearance> {
    if (jsonObj == null) {
      return new Err<Appearance>(
        "Invalid data: Appearance JSON object is null."
      );
    }

    if (definitions == null) {
      return new Err<Appearance>(
        "Invalid data: AppearanceDefinitions is null."
      );
    }

    // Parse 'index'
    const indexResult = getSafeU8(jsonObj, "index", "Appearance");
    const errorIndexResult = castErr<u8>(indexResult);
    if (errorIndexResult != null) {
      return new Err<Appearance>(errorIndexResult.error);
    }

    const okIndexResult = castOk<u8>(indexResult);
    if (okIndexResult == null) {
      return new Err<Appearance>("Unexpected error parsing 'index'.");
    }
    const index: u8 = okIndexResult.value; // Direct assignment

    // Get the definition
    const definition = definitions.getAppearanceDefinition(index);
    if (definition == null) {
      return new Err<Appearance>(
        `AppearanceDefinition with index ${index} not found.`
      );
    }

    // Extract the currentValue, maximumValue, and subProperty
    const extractedValuesResult = Appearance.extractValuesFromJSON(
      jsonObj,
      definition,
      index
    );

    const errorExtractedValuesResult = castErr<ExtractedAppearanceValues>(
      extractedValuesResult
    );
    if (errorExtractedValuesResult != null) {
      return new Err<Appearance>(errorExtractedValuesResult.error);
    }

    const okExtractedValuesResult = castOk<ExtractedAppearanceValues>(
      extractedValuesResult
    );
    if (okExtractedValuesResult == null) {
      return new Err<Appearance>(
        "Unexpected error extracting appearance values."
      );
    }
    const extractedValues: ExtractedAppearanceValues =
      okExtractedValuesResult.value;

    // Create the Property
    const property = new Property(
      index,
      extractedValues.currentValue,
      extractedValues.maximumValue,
      PropertyTypeIndex.Appearance,
      extractedValues.subProperty
    );

    // Create and return the Appearance instance wrapped in Ok
    return new Ok<Appearance>(new Appearance(property, definition));
  }

  /**
   * Extracts values from JSON for Appearance creation.
   * @param jsonObj - The JSON object.
   * @param definition - The corresponding AppearanceDefinition.
   * @param index - The index of the appearance.
   * @returns A Result containing ExtractedAppearanceValues or an error message.
   */
  private static extractValuesFromJSON(
    jsonObj: JSON.Obj,
    definition: AppearanceDefinition,
    index: u8
  ): Result<ExtractedAppearanceValues> {
    let currentValue: u8 = 0;
    let maximumValue: u8 = 0;
    let subProperty: SubProperty | null = null;

    if (
      definition.subProperties != null &&
      definition.subProperties.length > 0
    ) {
      // Handle sub-properties
      const subPropValueResult = getSafeU8(
        jsonObj,
        "currentValue",
        `Appearance (index: ${index})`
      );

      const errorSubPropValueResult = castErr<u8>(subPropValueResult);
      if (errorSubPropValueResult != null) {
        return new Err<ExtractedAppearanceValues>(
          errorSubPropValueResult.error
        );
      }

      const okSubPropValueResult = castOk<u8>(subPropValueResult);
      if (okSubPropValueResult == null) {
        return new Err<ExtractedAppearanceValues>(
          "Unexpected error parsing 'currentValue' for sub-properties."
        );
      }
      const subPropValue: u8 = okSubPropValueResult.value; // Direct assignment
      currentValue = subPropValue;
      maximumValue = subPropValue;

      // Get the corresponding sub-property
      subProperty = definition.getSubPropertyByValue(subPropValue);
      if (subProperty == null) {
        return new Err<ExtractedAppearanceValues>(
          `SubProperty with value ${subPropValue} not found for appearance index ${index}.`
        );
      }
    } else {
      // Handle appearances without sub-properties
      const currentValueResult = getSafeU8(
        jsonObj,
        "currentValue",
        `Appearance (index: ${index})`
      );

      const errorCurrentValueResult = castErr<u8>(currentValueResult);
      if (errorCurrentValueResult != null) {
        return new Err<ExtractedAppearanceValues>(
          errorCurrentValueResult.error
        );
      }

      const okCurrentValueResult = castOk<u8>(currentValueResult);
      if (okCurrentValueResult == null) {
        return new Err<ExtractedAppearanceValues>(
          "Unexpected error parsing 'currentValue'."
        );
      }
      currentValue = okCurrentValueResult.value; // Direct assignment

      const maximumValueResult = getSafeU8(
        jsonObj,
        "maximumValue",
        `Appearance (index: ${index})`
      );

      const errorMaximumValueResult = castErr<u8>(maximumValueResult);
      if (errorMaximumValueResult != null) {
        return new Err<ExtractedAppearanceValues>(
          errorMaximumValueResult.error
        );
      }

      const okMaximumValueResult = castOk<u8>(maximumValueResult);
      if (okMaximumValueResult == null) {
        return new Err<ExtractedAppearanceValues>(
          "Unexpected error parsing 'maximumValue'."
        );
      }
      maximumValue = okMaximumValueResult.value; // Direct assignment
    }

    return new Ok<ExtractedAppearanceValues>(
      new ExtractedAppearanceValues(currentValue, maximumValue, subProperty)
    );
  }
}

// ---------------------------------------------
// PixelPoint.ts (Unchanged)
// ---------------------------------------------

export class PixelPoint {
  x: u16;
  y: u16;

  constructor(xValue: u16, yValue: u16) {
    this.x = xValue;
    this.y = yValue;
  }
}

export class ExtractedAppearanceValues {
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
