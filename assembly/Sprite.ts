import { Property } from"./Property";
import { Pixel } from"./Pixel";
import { AppearanceDefinition } from "./GameItemDefinition";
import {
  CHARACTERISTICS_PROPERTY_MAX_INDEX,
  BEHAVIOR_PROPERTY_MIN_INDEX,
  MAX_STORED_CHARACTERISTICS,
  MAX_STORED_BEHAVIOURS,
  DATA_PIXEL_ALPHA_VALUE,
  DEFAULT_BLOCK_SIZE,
} from"./Constants";
import {
  SpriteTypeIndex,
  PixelTypeIndex,
  PropertyTypeIndex,
} from"./Enumerations";

export class Sprite {
  spriteType: SpriteTypeIndex;
  iPixelArray: Array<Array<Pixel>>;
  appearance: AppearanceDefinition;

  constructor(
    spriteTypeIndex: SpriteTypeIndex,
    absoluteTopLeftX: u16,
    absoluteTopLeftY: u16,
    appearance: AppearanceDefinition
  ) {
    this.spriteType = spriteTypeIndex;
    this.appearance = appearance;
    this.iPixelArray = this.initializePixelRepresentation();
  }

  /**
   * Initialize the sprite's pixel representation (both visual and data pixels).
   */
  initializePixelRepresentation(): Array<Array<Pixel>> {
    const pixelArray = new Array<Array<Pixel>>(
      this.appearance.visualization.length
    );
    for (let i = 0; i < this.appearance.visualization.length; i++) {
      pixelArray[i] = new Array<Pixel>(this.appearance.visualization[i].length);
      for (let j = 0; j < this.appearance.visualization[i].length; j++) {
        const pixelType = this.appearance.visualization[i][j]
          ? PixelTypeIndex.Visual
          : PixelTypeIndex.Data;
        pixelArray[i][j] = new Pixel(pixelType); // Initialize the pixel type
      }
    }
    return pixelArray;
  }

  /**
   * Persists characteristic properties into the data pixels.
   * Saves up to MAX_STORED_CHARACTERISTICS.
   */
  persistCharacteristics(characteristics: Array<Property>): void {
    let dataIndex: u8 = 0;
    for (let row = 0; row < this.iPixelArray.length; row++) {
      for (let col = 0; col < this.iPixelArray[row].length; col++) {
        let pixel = this.iPixelArray[row][col];
        if (
          pixel.pixelType === PixelTypeIndex.Data &&
          dataIndex < characteristics.length
        ) {
          const property = characteristics[dataIndex];
          pixel.setDataPacket(property); // Use the setDataPacket function
          dataIndex++;
        }
        if (dataIndex >= MAX_STORED_CHARACTERISTICS) break;
      }
      if (dataIndex >= MAX_STORED_CHARACTERISTICS) break;
    }
    console.log(`Persisted ${dataIndex} characteristics to data pixels.`);
  }

  /**
   * Persists behaviour properties into the data pixels.
   * Saves up to MAX_STORED_BEHAVIOURS.
   */
  persistBehaviours(behaviours: Array<Property>): void {
    let dataIndex: u8 = 0;
    for (let row = 0; row < this.iPixelArray.length; row++) {
      for (let col = 0; col < this.iPixelArray[row].length; col++) {
        let pixel = this.iPixelArray[row][col];
        if (
          pixel.pixelType === PixelTypeIndex.Data &&
          dataIndex < behaviours.length
        ) {
          const behaviour = behaviours[dataIndex];
          pixel.setDataPacket(behaviour); // Use the setDataPacket function
          dataIndex++;
        }
        if (dataIndex >= MAX_STORED_BEHAVIOURS) break;
      }
      if (dataIndex >= MAX_STORED_BEHAVIOURS) break;
    }
    console.log(`Persisted ${dataIndex} behaviours to data pixels.`);
  }

  /**
   * Reads characteristic properties from the data pixels.
   * Populates an array of characteristics, constrained by MAX_STORED_CHARACTERISTICS.
   */
  readCharacteristics(): Array<Property> {
    const data = this.readDataFromPixels();
    const characteristics: Array<Property> = [];
    let characteristicCount = 0;

    for (let i = 0; i < data.length; i += 3) {
      const index = data[i];
      const currentValue = data[i + 1];
      const maximumValue = data[i + 2];

      if (
        index <= CHARACTERISTICS_PROPERTY_MAX_INDEX &&
        characteristicCount < MAX_STORED_CHARACTERISTICS
      ) {
        const characteristic = new Property(
          index,
          currentValue,
          maximumValue,
          PropertyTypeIndex.Characteristic
        );
        characteristics.push(characteristic);
        characteristicCount++;
      }

      if (characteristicCount >= MAX_STORED_CHARACTERISTICS) {
        break;
      }
    }

    console.log(
      `Read ${characteristicCount} characteristics from data pixels.`
    );
    return characteristics;
  }

  /**
   * Reads behaviour properties from the data pixels.
   * Populates an array of behaviours, constrained by MAX_STORED_BEHAVIOURS.
   */
  readBehaviours(): Array<Property> {
    const data = this.readDataFromPixels();
    const behaviours: Array<Property> = [];
    let behaviourCount = 0;

    for (let i = 0; i < data.length; i += 3) {
      const index = data[i];
      const currentValue = data[i + 1];
      const maximumValue = data[i + 2];

      if (
        index >= BEHAVIOR_PROPERTY_MIN_INDEX &&
        behaviourCount < MAX_STORED_BEHAVIOURS
      ) {
        const behaviour = new Property(
          index,
          currentValue,
          maximumValue,
          PropertyTypeIndex.Behaviour
        );
        behaviours.push(behaviour);
        behaviourCount++;
      }

      if (behaviourCount >= MAX_STORED_BEHAVIOURS) {
        break;
      }
    }

    console.log(`Read ${behaviourCount} behaviours from data pixels.`);
    return behaviours;
  }

  /**
   * Reads appearance data from the visual pixels.
   * Extracts the appearance-related visual information.
   */
  readAppearance(): AppearanceDefinition {
    const visualPixels: boolean[][] = [];
    for (let i = 0; i < this.iPixelArray.length; i++) {
      visualPixels[i] = new Array<boolean>(this.iPixelArray[i].length);
      for (let j = 0; j < this.iPixelArray[i].length; j++) {
        const pixel = this.iPixelArray[i][j];
        visualPixels[i][j] = pixel.pixelType === PixelTypeIndex.Visual;
      }
    }

    console.log(`Read appearance data from visual pixels.`);
    return new AppearanceDefinition();
  }

  readDataFromPixels(): u8[] {
    let data: u8[] = [];
    for (let row: u8 = 0; row < DEFAULT_BLOCK_SIZE; row++) {
      for (let col: u8 = 0; col < DEFAULT_BLOCK_SIZE; col++) {
        let pixel = this.iPixelArray[row][col];
        // Check if the pixel is an initialized data pixel based on alpha
        if (
          pixel.pixelType === PixelTypeIndex.Data &&
          pixel.iAlpha === DATA_PIXEL_ALPHA_VALUE
        ) {
          let dataPacket = pixel.getDataPacket();
          // Push data to the array
          data.push(dataPacket.index);
          data.push(dataPacket.currentValue);
          data.push(dataPacket.maximumValue);
        } else {
          // Skip if the pixel is uninitialized
          continue;
        }
      }
    }
    return data;
  }
}
