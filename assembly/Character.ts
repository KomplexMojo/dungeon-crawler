import { Sprite } from "./Sprite";
import { Property } from "./Property";
import { PropertyTypeIndex, SpriteTypeIndex, SpriteTypeName} from "./Enumerations";
import { AppearanceDefinition, AppearanceDefinitions } from "./Appearance";
import {
  CHARACTERISTICS_PROPERTY_MAX_INDEX,
  BEHAVIOR_PROPERTY_MIN_INDEX,
  MAX_STORED_CHARACTERISTICS,
  MAX_STORED_BEHAVIOURS,
} from "./Constants";
import { Characteristic } from "./Characteristics";
import { Behaviour } from "./Behaviours";

/**
 * Character class derived from Sprite to represent different types of characters (self, neutral, ally, adversary).
 * Manages appearance, characteristics, and behavior properties for the character.
 */
export class Character extends Sprite {
  spriteTypeIndex: SpriteTypeIndex;
  characteristics: Array<Property> = []
  behaviours: Array<Property> = [];

  constructor(
    spriteTypeIndex: SpriteTypeIndex
  ) {
    let appearanceDefinition = new AppearanceDefinitions().getAppearanceDefinition(spriteTypeIndex);
    
    if(appearanceDefinition == null){
      throw new Error("pixelData not specified in AppearanceDefinition.");
    }
    
    super(spriteTypeIndex, 0, 0, appearanceDefinition);
    this.spriteTypeIndex = spriteTypeIndex;
  }

  loadCharacterIntoGame(startingX: u16, startinY: u16, startingCharacteristics: Characteristic[], startingBehaviours: Behaviour[] ): void
  {
  }

  /**
   * Persists the characteristic properties (such as health, mana) by calling the method in the Sprite superclass.
   */
  persistCharacteristics(): void {
    if (this.characteristics.length > 0) {
      super.persistCharacteristics(this.characteristics);
      console.log(
        `Persisted characteristics to character type: ${SpriteTypeName[(this.spriteTypeIndex as i32)]}`
      );
    } else {
      console.error(
        "No characteristic properties available for this character."
      );
    }
  }

  /**
   * Persists behavioral properties (such as NPC behavior) by calling the method in the Sprite superclass.
   */
  persistBehaviour(): void {
    if (this.behaviours.length > 0) {
      super.persistBehaviours(this.behaviours);
      console.log(
        `Persisted behavioural properties to character type: ${SpriteTypeName[(this.spriteTypeIndex as i32)]}`
      );
    } else {
      console.log("No behavioural properties to persist.");
    }
  }

  /**
   * Persists all property types (characteristics, behaviour) for the character.
   */
  persistAllProperties(): void {
    this.persistCharacteristics();
    this.persistBehaviour();
  }

  /**
   * Reads characteristic and behaviour properties from the data pixels.
   * Populates the local characteristics and behaviours arrays.
   * Respects the MAX_STORED_CHARACTERISTICS and MAX_STORED_BEHAVIOURS limits.
   */
  readCharacteristicsAndBehaviours(): void {
    const data = this.readDataFromPixels(); // Read all property data from pixels
    this.characteristics = [];
    this.behaviours = [];

    let characteristicCount = 0;
    let behaviourCount = 0;

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
      // If the index represents a behaviour, add to the behaviours array
      else if (
        index >= BEHAVIOR_PROPERTY_MIN_INDEX &&
        behaviourCount < MAX_STORED_BEHAVIOURS
      ) {
        const behaviour = new Property(
          index,
          currentValue,
          maximumValue,
          PropertyTypeIndex.Behaviour
        );
        this.behaviours.push(behaviour);
        behaviourCount++;
      }

      // Stop reading if we hit the max for both characteristics and behaviours
      if (
        characteristicCount >= MAX_STORED_CHARACTERISTICS &&
        behaviourCount >= MAX_STORED_BEHAVIOURS
      ) {
        break;
      }
    }

    console.log(
      `Read ${characteristicCount} characteristics and ${behaviourCount} behaviours from data pixels.`
    );
  }
}
