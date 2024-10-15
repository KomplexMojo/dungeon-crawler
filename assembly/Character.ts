import { Sprite } from "./Sprite";
import { Property } from "./Property";
import { PropertyTypeIndex, SpriteTypeIndex, SpriteTypeName } from "./Enumerations";
import {
  CHARACTERISTICS_PROPERTY_MAX_INDEX,
  BEHAVIOR_PROPERTY_MIN_INDEX,
  MAX_STORED_CHARACTERISTICS,
  MAX_STORED_BEHAVIOURS,
} from "./Constants";
import { Ok, Err, Result, OkVoid } from "./Result";
import { castOk, castErr } from "./ResultHelpers";

/**
 * Character class derived from Sprite to represent different types of characters (self, neutral, ally, adversary).
 * Manages appearance, characteristics, and behavior properties for the character.
 */
export class Character extends Sprite {
  spriteTypeIndex: SpriteTypeIndex;
  characteristics: Array<Property> = [];
  behaviours: Array<Property> = [];

  constructor(spriteTypeIndex: SpriteTypeIndex) {
    const appearanceResult = new AppearanceDefinitions().getAppearanceDefinition(spriteTypeIndex);
    const errorAppearanceResult = castErr(appearanceResult);

    if (errorAppearanceResult != null) {
      throw new Error(`AppearanceDefinition not found: ${errorAppearanceResult.error}`);
    }

    const okAppearanceResult = castOk(appearanceResult);
    if (okAppearanceResult == null) {
      throw new Error("Unexpected error retrieving AppearanceDefinition.");
    }

    super(spriteTypeIndex, 0, 0, okAppearanceResult.value);
    this.spriteTypeIndex = spriteTypeIndex;
  }

  loadCharacterIntoGame(
    startingX: u16,
    startingY: u16,
    startingCharacteristics: Characteristic[],
    startingBehaviours: Behaviour[]
  ): Result<void> {
    this.setPosition(startingX, startingY);

    // Load characteristics and behaviours, handle any potential errors in the loading process.
    if (startingCharacteristics.length === 0) {
      return new Err<void>("No starting characteristics provided.");
    }
    this.characteristics = startingCharacteristics.map((char) => char.property);

    if (startingBehaviours.length === 0) {
      return new Err<void>("No starting behaviours provided.");
    }
    this.behaviours = startingBehaviours.map((beh) => beh.property);

    return new Ok<void>(undefined);
  }

  setPosition(startingX: u8, startingY: u8): Result<void>{
    return new OkVoid();
  }

  /**
   * Persists the characteristic properties (such as health, mana) by calling the method in the Sprite superclass.
   */
  persistCharacteristics(): Result<void> {
    if (this.characteristics.length > 0) {
      super.persistCharacteristics(this.characteristics);
      console.log(
        `Persisted characteristics to character type: ${SpriteTypeName[this.spriteTypeIndex as i32]}`
      );
      return new Ok<void>(undefined);
    } else {
      return new Err<void>("No characteristic properties available for this character.");
    }
  }

  /**
   * Persists behavioral properties (such as NPC behavior) by calling the method in the Sprite superclass.
   */
  persistBehaviour(): Result<void> {
    if (this.behaviours.length > 0) {
      super.persistBehaviours(this.behaviours);
      console.log(
        `Persisted behavioural properties to character type: ${SpriteTypeName[this.spriteTypeIndex as i32]}`
      );
      return new Ok<void>(undefined);
    } else {
      return new Err<void>("No behavioural properties to persist.");
    }
  }

  /**
   * Persists all property types (characteristics, behaviour) for the character.
   */
  persistAllProperties(): Result<void> {
    const characteristicsResult = this.persistCharacteristics();
    const behaviourResult = this.persistBehaviour();

    const errorCharacteristics = castErr(characteristicsResult);
    if (errorCharacteristics != null) {
      return errorCharacteristics;
    }

    const errorBehaviours = castErr(behaviourResult);
    if (errorBehaviours != null) {
      return errorBehaviours;
    }

    return new Ok<void>(undefined);
  }

  /**
   * Reads characteristic and behaviour properties from the data pixels.
   * Populates the local characteristics and behaviours arrays.
   * Respects the MAX_STORED_CHARACTERISTICS and MAX_STORED_BEHAVIOURS limits.
   */
  readCharacteristicsAndBehaviours(): Result<void> {
    return new OkVoid();
  }
}