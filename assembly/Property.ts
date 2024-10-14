// Property.ts

import { PropertyTypeIndex, PixelTypeIndex } from "./Enumerations";
import {
  CHARACTERISTICS_PROPERTY_MIN_INDEX,
  CHARACTERISTICS_PROPERTY_MAX_INDEX,
  BEHAVIOR_PROPERTY_MIN_INDEX,
  BEHAVIOR_PROPERTY_MAX_INDEX,
} from "./Constants";
import { Pixel } from "./Pixel";
import { SubProperty } from "./SubProperty";
import { JSON } from "assemblyscript-json/assembly";

export class Property {
  propertyTypeIndex: PropertyTypeIndex;
  index: u8;
  currentValue: u8;
  maximumValue: u8;
  subProperty: SubProperty | null;

  constructor(
    index: u8,
    currentValue: u8 = 0,
    maximumValue: u8 = 0,
    propertyTypeIndex?: PropertyTypeIndex,
    subProperty: SubProperty | null = null
  ) {
    this.index = index;
    this.currentValue = currentValue;
    this.maximumValue = maximumValue;
    this.subProperty = subProperty;

    // If propertyTypeIndex is provided, use it; otherwise, determine it based on the index
    if (propertyTypeIndex !== undefined) {
      this.propertyTypeIndex = propertyTypeIndex;
    } else {
      this.propertyTypeIndex = this.determinePropertyType(this.index);
    }
  }

  /**
   * Determines the property type based on the index.
   */
  private determinePropertyType(index: u8): PropertyTypeIndex {
    if (
      index >= CHARACTERISTICS_PROPERTY_MIN_INDEX &&
      index <= CHARACTERISTICS_PROPERTY_MAX_INDEX
    ) {
      return PropertyTypeIndex.Characteristic;
    } else if (
      index >= BEHAVIOR_PROPERTY_MIN_INDEX &&
      index <= BEHAVIOR_PROPERTY_MAX_INDEX
    ) {
      return PropertyTypeIndex.Behaviour;
    } else if (index === 255) {
      return PropertyTypeIndex.Appearance;
    } else {
      throw new Error(`Invalid property index: ${index}`);
    }
  }

  /**
   * Creates a Property instance from a data Pixel.
   */
  static fromPixel(pixel: Pixel): Property {
    if (pixel.pixelType !== PixelTypeIndex.Data) {
      throw new Error("Attempted to create Property from a non-data Pixel.");
    }

    const index = pixel.iRed;
    const currentValue = pixel.iGreen;
    const maximumValue = pixel.iBlue;
    const propertyTypeIndex = pixel.determinePropertyType(index);

    return new Property(index, currentValue, maximumValue, propertyTypeIndex);
  }

  /**
   * Converts this Property into a data Pixel.
   */
  toPixel(): Pixel {
    const pixel = new Pixel(PixelTypeIndex.Data);
    pixel.setDataPacket(this);
    return pixel;
  }

  /**
   * Creates a Property instance from a JSON object.
   */
  static fromJSON(jsonObj: JSON.Obj): Property {
    const indexValue = jsonObj.getInteger("index");
    if (indexValue == null) {
      throw new Error("Property index not specified.");
    }
    const index = indexValue.valueOf() as u8;

    const currentValueValue = jsonObj.getInteger("currentValue");
    const currentValue = currentValueValue
      ? (currentValueValue.valueOf() as u8)
      : 0;

    const maximumValueValue = jsonObj.getInteger("maximumValue");
    const maximumValue = maximumValueValue
      ? (maximumValueValue.valueOf() as u8)
      : 0;

    const propertyTypeIndexValue = jsonObj.getInteger("propertyTypeIndex");
    const propertyTypeIndex = propertyTypeIndexValue
      ? (propertyTypeIndexValue.valueOf() as PropertyTypeIndex)
      : undefined;

    // Handle subProperty if present
    let subProperty: SubProperty | null = null;
    const subPropertyValue = jsonObj.getObj("subProperty");
    if (subPropertyValue != null) {
      subProperty = SubProperty.fromJSON(subPropertyValue);
    }

    return new Property(
      index,
      currentValue,
      maximumValue,
      propertyTypeIndex,
      subProperty
    );
  }
}
