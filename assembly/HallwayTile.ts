import { Sprite } from "./Sprite";
import { Property } from "./Property";
import { PropertyTypeIndex, SpriteTypeIndex, SpriteTypeName } from "./Enumerations";
import { AppearanceDefinition } from "./GameItemDefinition";
import {
  CHARACTERISTICS_PROPERTY_MAX_INDEX,
  MAX_STORED_CHARACTERISTICS
} from "./Constants";

/**
 * Character class derived from Sprite to represent different types of characters (self, neutral, ally, adversary).
 * Manages appearance, characteristics, and behavior properties for the character.
 */
export class HallwayTile extends Sprite {
  characteristics: Array<Property>;

  constructor(
    absoluteTopLeftX: u16,
    absoluteTopLeftY: u16,
    appearance: AppearanceDefinition, // Appearance passed to Sprite superclass
    characteristics: Array<Property> = [], // Pre-loaded characteristics properties
  ) {
    super(SpriteTypeIndex.HallwayTile, absoluteTopLeftX, absoluteTopLeftY, appearance);
    this.characteristics = characteristics; // Characteristics properties (e.g., health, stamina)
  }

  /**
   * Persists the characteristic properties (such as health, mana) by calling the method in the Sprite superclass.
   */
  persistCharacteristics(): void {
    if (this.characteristics.length > 0) {
      super.persistCharacteristics(this.characteristics);
      console.log(
        `Persisted characteristics to item type: ${SpriteTypeName[SpriteTypeIndex.HallwayTile]}`
      );
    } else {
      console.error(
        "No characteristic properties available for this character."
      );
    }
  }

  /**
   * Reads characteristic and behaviour properties from the data pixels.
   * Populates the local characteristics and behaviours arrays.
   * Respects the MAX_STORED_CHARACTERISTICS and MAX_STORED_BEHAVIOURS limits.
   */
  readCharacteristicsAndBehaviours(): void {
    const data = this.readDataFromPixels(); // Read all property data from pixels
    this.characteristics = [];

    let characteristicCount = 0;

    // Iterate over data array in chunks of 3: index, currentValue, maximumValue
    for (let i = 0; i < data.length; i += 3) {
      const index = data[i];
      const currentValue = data[i + 1];
      const maximumValue = data[i + 2];

      // If the index represents a characteristic, add to the characteristics array
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
        this.characteristics.push(characteristic);
        characteristicCount++;
      }

      // Stop reading if we hit the max for both characteristics and behaviours
      if (
        characteristicCount >= MAX_STORED_CHARACTERISTICS) {
        break;
      }
    }

    console.log(
      `Read ${characteristicCount} characteristics behaviours from data pixels.`
    );
  }
}
