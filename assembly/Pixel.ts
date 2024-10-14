// Pixel.ts

import { Property } from "./Property";
import { PixelTypeIndex, PropertyTypeIndex } from "./Enumerations";
import {
  CHARACTERISTICS_PROPERTY_MIN_INDEX,
  CHARACTERISTICS_PROPERTY_MAX_INDEX,
  BEHAVIOR_PROPERTY_MIN_INDEX,
  BEHAVIOR_PROPERTY_MAX_INDEX,
  MAX_COLOR_VALUE,
  MIN_COLOR_VALUE,
  DATA_PIXEL_ALPHA_VALUE,
  VISUAL_PIXEL_ALPHA_VALUE,
} from "./Constants";

export class Pixel {
  iRed: u8 = MIN_COLOR_VALUE;
  iGreen: u8 = MIN_COLOR_VALUE;
  iBlue: u8 = MIN_COLOR_VALUE;
  iAlpha: u8 = MIN_COLOR_VALUE;
  pixelType: PixelTypeIndex;

  constructor(pixelType: PixelTypeIndex) {
    this.pixelType = pixelType;

    if (pixelType === PixelTypeIndex.Visual) {
      this.initializeDefaultVisualPixel();
    } else if (pixelType === PixelTypeIndex.Data) {
      this.initializeDefaultDataPixel();
    }
  }

  /**
   * Initializes the pixel as a default visual pixel, fully visible with max RGBA values.
   */
  initializeDefaultVisualPixel(): void {
    this.iRed = MAX_COLOR_VALUE; // Fully white visual pixel
    this.iGreen = MAX_COLOR_VALUE;
    this.iBlue = MAX_COLOR_VALUE;
    this.iAlpha = VISUAL_PIXEL_ALPHA_VALUE; // Max alpha for fully visible pixel
  }

  /**
   * Initializes the pixel as a default data pixel with RGBA set to minimum values.
   */
  initializeDefaultDataPixel(): void {
    this.iRed = MIN_COLOR_VALUE;
    this.iGreen = MIN_COLOR_VALUE;
    this.iBlue = MIN_COLOR_VALUE;
    this.iAlpha = DATA_PIXEL_ALPHA_VALUE; // Transparent alpha for data pixel
  }

  /**
   * Sets the pixel to a visual pixel with defined RGB values and max alpha.
   */
  setVisualData(red: u8, green: u8, blue: u8): void {
    if (this.pixelType === PixelTypeIndex.Visual) {
      this.iRed = red;
      this.iGreen = green;
      this.iBlue = blue;
      this.iAlpha = VISUAL_PIXEL_ALPHA_VALUE; // Ensure pixel is fully visible
    } else {
      throw new Error("Attempted to set visual data on a non-visual pixel.");
    }
  }

  /**
   * Sets the pixel to an initialized data pixel, storing property data.
   */
  setDataPacket(property: Property): void {
    if (this.pixelType === PixelTypeIndex.Data) {
      this.iRed = property.index; // Store property index in red
      this.iGreen = property.currentValue; // Store current value in green
      this.iBlue = property.maximumValue; // Store maximum value in blue
      this.iAlpha = DATA_PIXEL_ALPHA_VALUE; // Transparent alpha for data pixel
    } else {
      throw new Error("Attempted to set data on a non-data pixel.");
    }
  }

  /**
   * Retrieves data from a data pixel and returns it as a Property.
   */
  getDataPacket(): Property {
    if (this.pixelType === PixelTypeIndex.Data) {
      const index = this.iRed;
      const currentValue = this.iGreen;
      const maximumValue = this.iBlue;
      const propertyTypeIndex = this.determinePropertyType(index);

      return new Property(
        index,
        currentValue,
        maximumValue,
        propertyTypeIndex
      );
    } else {
      throw new Error("Attempted to retrieve data from a non-data pixel.");
    }
  }

  /**
   * Determines the property type based on the index.
   */
  public determinePropertyType(index: u8): PropertyTypeIndex {
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
   * Determines whether the pixel is initialized as a visual pixel.
   */
  isInitializedVisual(): bool {
    return (
      this.pixelType === PixelTypeIndex.Visual &&
      this.iAlpha === VISUAL_PIXEL_ALPHA_VALUE &&
      (this.iRed !== MIN_COLOR_VALUE ||
        this.iGreen !== MIN_COLOR_VALUE ||
        this.iBlue !== MIN_COLOR_VALUE)
    );
  }

  /**
   * Determines whether the pixel is initialized as a data pixel.
   */
  isInitializedData(): bool {
    return (
      this.pixelType === PixelTypeIndex.Data &&
      this.iAlpha === DATA_PIXEL_ALPHA_VALUE &&
      (this.iRed !== MIN_COLOR_VALUE ||
        this.iGreen !== MIN_COLOR_VALUE ||
        this.iBlue !== MIN_COLOR_VALUE)
    );
  }

  /**
   * Resets a visual pixel back to its default state.
   */
  resetVisualPixel(): void {
    this.initializeDefaultVisualPixel();
  }

  /**
   * Resets a data pixel back to its default state.
   */
  resetDataPixel(): void {
    this.initializeDefaultDataPixel();
  }

  /**
   * Sets the pixel type and reinitializes the pixel based on the type.
   */
  setType(newType: PixelTypeIndex): void {
    this.pixelType = newType;

    if (newType === PixelTypeIndex.Visual) {
      this.initializeDefaultVisualPixel();
    } else if (newType === PixelTypeIndex.Data) {
      this.initializeDefaultDataPixel();
    }
  }

  /**
   * Gets the pixel type.
   */
  getType(): PixelTypeIndex {
    return this.pixelType;
  }
}