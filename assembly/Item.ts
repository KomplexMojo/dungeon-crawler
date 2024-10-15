import { Sprite } from "./Sprite";
import { Property} from "./Property";
import { SpriteTypeIndex } from "./Enumerations";
import { AppearanceDefinition } from "./GameItemDefinition";

/**
 * Item class derived from Sprite to represent different types of items (e.g., weapons, artifacts).
 * Focuses on characteristics and behaviors. Appearance is managed by the Sprite superclass.
 */
export class Item extends Sprite {
  characteristics: Array<Property>;
  behaviours: Array<Property>;

  constructor(
    spriteTypeIndex: SpriteTypeIndex,
    absoluteTopLeftX: u16,
    absoluteTopLeftY: u16,
    appearance: AppearanceDefinition, // Appearance passed to the Sprite superclass
    characteristics: Array<Property> = [], // Pre-loaded characteristics properties
    behaviours: Array<Property> = [] // Pre-loaded behavior properties
  ) {
    // Call the Sprite superclass constructor to handle appearance
    super(spriteTypeIndex, absoluteTopLeftX, absoluteTopLeftY, appearance);

    this.characteristics = characteristics; // Item-specific properties (e.g., durability, magic affinity)
    this.behaviours = behaviours; // Optional behaviors (e.g., growth, curse effects)
  }

  /**
   * Applies the characteristic properties (e.g., durability, power) to the item.
   */
  applyCharacteristics(): void {
    if (this.characteristics.length > 0) {
      super.persistCharacteristics(this.characteristics); // Store item characteristics in non-visual pixels
      console.log(`Applied characteristics to item of type: ${this.spriteType}`);
    } else {
      console.error("No characteristic properties available for this item.");
    }
  }

  /**
   * Applies the behavioral properties (if any) to the item.
   * Example: Growth, Curse effects, etc.
   */
  applyBehaviours(): void {
    if (this.behaviours.length > 0) {
      super.persistBehaviours(this.behaviours); // Store item behaviors in non-visual pixels
      console.log(`Applied behavioural properties to item of type: ${this.spriteType}`);
    } else {
      console.log("No behavioural properties to apply.");
    }
  }

  /**
   * Applies all property types (characteristics, behaviours) to the item.
   */
  applyAllProperties(): void {
    this.applyCharacteristics();
    this.applyBehaviours();
  }
}