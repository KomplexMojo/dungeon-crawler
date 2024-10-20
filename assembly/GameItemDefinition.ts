import { GrowthTypeIndex, GrowthTypeString } from "./Enumerations";
import { Result, Ok, Err, OkVoid, castErr, castOk } from "./Result";
import { JSON } from "assemblyscript-json/assembly";
import { loadArray } from "./ArrayUtils";
import { getSafeU8, getSafeString, parseBool2DArray } from "./JSONUtils";

// ---------------------------------------------
// Base GameItemDefinition Class
// ---------------------------------------------

export abstract class GameItemDefinition {
  index: u8;
  name: string;
  description: string;
  defaults: Defaults;
  properties: SubProperty[] | null;

  constructor() {
    this.index = 0;
    this.name = "";
    this.description = "";
    this.defaults = new Defaults();
    this.properties = null;
  }

  /**
   * Loads common properties from JSON.
   * @param jsonObj - The JSON object representing the game item.
   * @returns A Result indicating success or containing an error message.
   */
  protected loadCommonFromJSON(jsonObj: JSON.Obj | null): Result<void> {
    if (jsonObj == null) {
      return new Err<void>(
        "Invalid data for GameItemDefinition: JSON object is null."
      );
    }

    // Parse 'index'
    const indexResult: Result<u8> = getSafeU8(
      jsonObj,
      "index",
      "GameItemDefinition"
    );
    const errorIndexResult: Err<u8> | null = castErr<u8>(indexResult);
    if (errorIndexResult != null) {
      return new Err<void>(errorIndexResult.error);
    }

    const okIndexResult: Ok<u8> | null = castOk<u8>(indexResult);
    if (okIndexResult == null) {
      return new Err<void>("Unexpected error parsing 'index'.");
    }
    this.index = okIndexResult.value;

    // Parse 'name'
    const nameResult: Result<string> = getSafeString(
      jsonObj,
      "name",
      "GameItemDefinition"
    );
    const errorNameResult: Err<string> | null = castErr<string>(nameResult);
    if (errorNameResult != null) {
      return new Err<void>(errorNameResult.error);
    }

    const okNameResult: Ok<string> | null = castOk<string>(nameResult);
    if (okNameResult == null) {
      return new Err<void>("Unexpected error parsing 'name'.");
    }
    this.name = okNameResult.value;

    // Parse 'description'
    const descriptionResult: Result<string> = getSafeString(
      jsonObj,
      "description",
      "GameItemDefinition"
    );
    const errorDescriptionResult: Err<string> | null =
      castErr<string>(descriptionResult);
    if (errorDescriptionResult != null) {
      return new Err<void>(errorDescriptionResult.error);
    }

    const okDescriptionResult: Ok<string> | null =
      castOk<string>(descriptionResult);
    if (okDescriptionResult == null) {
      return new Err<void>("Unexpected error parsing 'description'.");
    }
    this.description = okDescriptionResult.value;

    // Parse 'defaults'
    const defaultsValue = jsonObj.get("defaults");
    if (defaultsValue == null || !defaultsValue.isObj) {
      return new Err<void>(
        "'defaults' field is missing or is not an object in GameItemDefinition."
      );
    }

    const defaultsObj = defaultsValue as JSON.Obj;

    // Parse 'growth'
    const growthResult = getSafeString(
      defaultsObj,
      "growth",
      "GameItemDefinition.defaults"
    );
    const errorGrowthResult = castErr<string>(growthResult);
    if (errorGrowthResult != null) {
      return new Err<void>(errorGrowthResult.error);
    }

    const okGrowthResult = castOk<string>(growthResult);
    if (okGrowthResult == null) {
      return new Err<void>("Unexpected error parsing 'growth'.");
    }

    const growth: string = okGrowthResult.value;

    // Map the string to GrowthTypeIndex enum using the helper function
    const mappedGrowthResult: Result<GrowthTypeIndex> =
      mapStringToGrowthType(growth);
    const errorMappedGrowth = castErr<GrowthTypeIndex>(mappedGrowthResult);
    if (errorMappedGrowth != null) {
      return new Err<void>(errorMappedGrowth.error);
    }

    const okMappedGrowth = castOk<GrowthTypeIndex>(mappedGrowthResult);
    if (okMappedGrowth == null) {
      return new Err<void>("Unexpected error mapping 'growth' value.");
    }

    this.defaults.growth = okMappedGrowth.value;

    // Parse 'required'
    const requiredValue = defaultsObj.get("required");
    if (requiredValue == null || !requiredValue.isBool) {
      return new Err<void>(
        "'required' field missing or is not a boolean in GameItemDefinition.defaults."
      );
    }
    const requiredBool = requiredValue as JSON.Bool;
    this.defaults.required = requiredBool.valueOf();

    // Parse 'properties' if present
    const propertiesValue = jsonObj.get("properties");
    if (propertiesValue != null) {
      if (!propertiesValue.isArr) {
        return new Err<void>(
          "'properties' field is not an array in GameItemDefinition."
        );
      }

      const propertiesArr = propertiesValue as JSON.Arr;

      const subPropsResult: Result<SubProperty[]> = loadArray<SubProperty>(
        propertiesArr,
        (subPropJson: JSON.Obj) => SubProperty.fromJSON(subPropJson),
        "GameItemDefinition"
      );

      const errorSubPropsResult: Err<SubProperty[]> | null =
        castErr<SubProperty[]>(subPropsResult);
      if (errorSubPropsResult != null) {
        return new Err<void>(errorSubPropsResult.error);
      }

      const okSubPropsResult: Ok<SubProperty[]> | null =
        castOk<SubProperty[]>(subPropsResult);
      if (okSubPropsResult == null) {
        return new Err<void>(
          "Unexpected error parsing 'properties' in GameItemDefinition."
        );
      }
      this.properties = okSubPropsResult.value;
    } else {
      this.properties = null;
    }

    return new OkVoid();
  }

  /**
   * Abstract method to load item-specific properties from JSON.
   * @param jsonObj - The JSON object representing the game item.
   * @returns A Result indicating success or containing an error message.
   */
  abstract loadSpecificFromJSON(jsonObj: JSON.Obj | null): Result<void>;

  /**
   * Factory method to create a GameItemDefinition subclass instance from a JSON object.
   * @param jsonObj - The JSON object.
   * @returns A Result containing either the GameItemDefinition instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<GameItemDefinition> {
    if (jsonObj == null) {
      return new Err<GameItemDefinition>("Invalid data: JSON object is null.");
    }

    // Determine the type based on 'index'
    const indexResult: Result<u8> = getSafeU8(
      jsonObj,
      "index",
      "GameItemDefinition.fromJSON"
    );
    const errorIndexResult: Err<u8> | null = castErr<u8>(indexResult);
    if (errorIndexResult != null) {
      return new Err<GameItemDefinition>(errorIndexResult.error);
    }

    const okIndexResult: Ok<u8> | null = castOk<u8>(indexResult);
    if (okIndexResult == null) {
      return new Err<GameItemDefinition>("Unexpected error parsing 'index'.");
    }

    const indexValue: u8 = okIndexResult.value;

    let item: GameItemDefinition | null = null;

    if (indexValue >= 0 && indexValue <= 11) {
      item = new AppearanceDefinition();
    } else if (indexValue >= 12 && indexValue <= 199) {
      item = new CharacteristicDefinition();
    } else if (indexValue >= 200 && indexValue <= 255) {
      item = new BehaviourDefinition();
    } else {
      return new Err<GameItemDefinition>(
        `Invalid 'index' value ${indexValue} for GameItemDefinition.`
      );
    }

    // Load common properties
    const loadCommonResult: Result<void> = item.loadCommonFromJSON(jsonObj);
    const errorCommonResult: Err<void> | null = castErr<void>(loadCommonResult);
    if (errorCommonResult != null) {
      return new Err<GameItemDefinition>(errorCommonResult.error);
    }

    // Load specific properties
    const loadSpecificResult: Result<void> = item.loadSpecificFromJSON(jsonObj);
    const errorSpecificResult: Err<void> | null =
      castErr<void>(loadSpecificResult);
    if (errorSpecificResult != null) {
      return new Err<GameItemDefinition>(errorSpecificResult.error);
    }

    return new Ok<GameItemDefinition>(item);
  }

  /**
   * Abstract method to serialize the GameItemDefinition instance to a JSON string.
   * Must be implemented by all subclasses.
   * @returns A JSON string representing the GameItemDefinition instance.
   */
  abstract toJSON(): string;
}

/**
 * Represents default settings for a game item.
 */
class Defaults {
  required: bool;
  growth: GrowthTypeIndex;

  constructor() {
    this.required = false;
    this.growth = GrowthTypeIndex.Fixed;
  }
}

// ---------------------------------------------
// AppearanceDefinition Class
// ---------------------------------------------

export class AppearanceDefinition extends GameItemDefinition {
  visualization: bool[][];

  constructor() {
    super();
    this.visualization = [];
  }

  /**
   * Loads Appearance-specific properties from JSON.
   * @param jsonObj - The JSON object representing an AppearanceDefinition.
   * @returns A Result indicating success or containing an error message.
   */
  loadSpecificFromJSON(jsonObj: JSON.Obj | null): Result<void> {
    if (jsonObj == null) {
      return new Err<void>(
        "Invalid data for AppearanceDefinition: JSON object is null."
      );
    }

    // Parse 'visualization'
    const visualizationValue = jsonObj.get("visualization");
    if (visualizationValue == null || !visualizationValue.isArr) {
      return new Err<void>(
        "'visualization' field is missing or is not an array in AppearanceDefinition."
      );
    }

    const visualizationArr = visualizationValue as JSON.Arr;

    const visualizationResult: Result<bool[][]> =
      parseBool2DArray(visualizationArr);
    const errorVisualizationResult: Err<bool[][]> | null =
      castErr<bool[][]>(visualizationResult);
    if (errorVisualizationResult != null) {
      return new Err<void>(errorVisualizationResult.error);
    }

    const okVisualizationResult: Ok<bool[][]> | null =
      castOk<bool[][]>(visualizationResult);
    if (okVisualizationResult == null) {
      return new Err<void>(
        "Unexpected error parsing 'visualization' in AppearanceDefinition."
      );
    }

    this.visualization = okVisualizationResult.value;

    return new OkVoid();
  }

  /**
   * Serializes the AppearanceDefinition instance to a JSON string.
   * @returns A JSON string representing the AppearanceDefinition.
   */
  toJSON(): string {
    let visualizationJson = serializeBool2DArray(this.visualization);
    let propertiesJson = serializeSubProperties(this.properties);
    let defaultsJson = `{ "required": ${this.defaults.required}, "growth": "${
      GrowthTypeString[this.defaults.growth]
    }" }`;

    return `{ 
      "index": ${this.index}, 
      "name": "${escapeString(this.name)}", 
      "description": "${escapeString(this.description)}", 
      "defaults": ${defaultsJson}, 
      "visualization": ${visualizationJson}, 
      "properties": ${propertiesJson} 
    }`;
  }
}

/**
 * Serializes a 2D array of booleans to a JSON string.
 * @param arr - The 2D array of booleans.
 * @returns A JSON string representing the 2D array.
 */
function serializeBool2DArray(arr: bool[][]): string {
  let jsonStr = "[";
  for (let i = 0; i < arr.length; i++) {
    jsonStr += "[";
    for (let j = 0; j < arr[i].length; j++) {
      jsonStr += arr[i][j] ? "true" : "false";
      if (j < arr[i].length - 1) jsonStr += ",";
    }
    jsonStr += "]";
    if (i < arr.length - 1) jsonStr += ",";
  }
  jsonStr += "]";
  return jsonStr;
}

// ---------------------------------------------
// CharacteristicDefinition Class
// ---------------------------------------------

export class CharacteristicDefinition extends GameItemDefinition {
  // Add any Characteristic-specific fields if necessary

  constructor() {
    super();
    // Initialize any Characteristic-specific fields
  }

  /**
   * Loads Characteristic-specific properties from JSON.
   * @param jsonObj - The JSON object representing a CharacteristicDefinition.
   * @returns A Result indicating success or containing an error message.
   */
  loadSpecificFromJSON(jsonObj: JSON.Obj | null): Result<void> {
    // Implement parsing logic for CharacteristicDefinition if needed
    return new OkVoid();
  }

  /**
   * Serializes the CharacteristicDefinition instance to a JSON string.
   * @returns A JSON string representing the CharacteristicDefinition.
   */
  toJSON(): string {
    let propertiesJson = serializeSubProperties(this.properties);
    let defaultsJson = `{ "required": ${this.defaults.required}, "growth": "${
      GrowthTypeString[this.defaults.growth]
    }" }`;

    return `{ 
    "index": ${this.index}, 
    "name": "${escapeString(this.name)}", 
    "description": "${escapeString(this.description)}", 
    "defaults": ${defaultsJson}, 
    "properties": ${propertiesJson} 
  }`;
  }
}

// ---------------------------------------------
// BehaviourDefinition Class
// ---------------------------------------------

export class BehaviourDefinition extends GameItemDefinition {
  // Add any Behaviour-specific fields if necessary

  constructor() {
    super();
    // Initialize any Behaviour-specific fields
  }

  /**
   * Loads Behaviour-specific properties from JSON.
   * @param jsonObj - The JSON object representing a BehaviourDefinition.
   * @returns A Result indicating success or containing an error message.
   */
  loadSpecificFromJSON(jsonObj: JSON.Obj | null): Result<void> {
    // Implement parsing logic for BehaviourDefinition if needed
    return new OkVoid();
  }

  /**
   * Serializes the BehaviourDefinition instance to a JSON string.
   * @returns A JSON string representing the BehaviourDefinition.
   */
  toJSON(): string {
    let propertiesJson = serializeSubProperties(this.properties);
    let defaultsJson = `{ "required": ${this.defaults.required}, "growth": "${
      GrowthTypeString[this.defaults.growth]
    }" }`;

    return `{ 
      "index": ${this.index}, 
      "name": "${escapeString(this.name)}", 
      "description": "${escapeString(this.description)}", 
      "defaults": ${defaultsJson}, 
      "properties": ${propertiesJson} 
    }`;
  }
}

export class SubProperty {
  value: u8; // Enforced to be within 0-255
  name: string;
  description: string;

  constructor(value: u8, name: string, description: string) {
    this.value = value;
    this.name = name;
    this.description = description;
  }

  /**
   * Factory method to create a SubProperty instance from a JSON object.
   * @param jsonObj - The JSON object representing a SubProperty.
   * @returns A Result containing either a new SubProperty instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<SubProperty> {
    if (jsonObj == null) {
      return new Err<SubProperty>(
        "Invalid data for SubProperty: JSON object is null."
      );
    }

    // Parse 'value'
    const valueObj = jsonObj.getInteger("value");
    if (valueObj == null) {
      return new Err<SubProperty>("Value not specified in SubProperty.");
    }
    const tempValue: i64 = valueObj.valueOf();

    // Validate and cast 'value' from i64 to u8
    const U8_MAX: i64 = 255;
    const U8_MIN: i64 = 0;
    if (tempValue > U8_MAX || tempValue < U8_MIN) {
      return new Err<SubProperty>(
        `Value ${tempValue} out of range for u8 in SubProperty (0-255).`
      );
    }
    const value: u8 = u8(tempValue); // Explicit cast after validation

    // Parse 'name'
    const nameObj = jsonObj.getString("name");
    if (nameObj == null) {
      return new Err<SubProperty>("Name not specified in SubProperty.");
    }
    const name: string = nameObj.valueOf();

    // Parse 'description'
    const descriptionObj = jsonObj.getString("description");
    if (descriptionObj == null) {
      return new Err<SubProperty>("Description not specified in SubProperty.");
    }
    const description: string = descriptionObj.valueOf();

    // Create and return the SubProperty instance wrapped in Ok
    return new Ok<SubProperty>(new SubProperty(value, name, description));
  }

  /**
   * Serializes the SubProperty instance to a JSON string.
   * @returns A JSON string representing the SubProperty.
   */
  toJSON(): string {
    // Escape strings to ensure valid JSON formatting
    let escapedName = escapeString(this.name);
    let escapedDescription = escapeString(this.description);

    // Construct the JSON string
    return `{ 
      "value": ${this.value}, 
      "name": "${escapedName}", 
      "description": "${escapedDescription}" 
    }`;
  }
}

// Trigger.ts

/**
 * Represents a trigger for an event.
 */
export class Trigger {
  type: string;
  action: string;

  constructor(type: string, action: string) {
    this.type = type;
    this.action = action;
  }

  /**
   * Factory method to create a Trigger instance from a JSON object.
   * @param jsonObj - The JSON object representing a Trigger.
   * @returns A Result containing either a new Trigger instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<Trigger> {
    if (jsonObj == null) {
      return new Err<Trigger>("Invalid data for Trigger: JSON object is null.");
    }

    const typeObj = jsonObj.getString("type");
    if (typeObj == null) {
      return new Err<Trigger>("Trigger type not specified.");
    }
    const type: string = typeObj.valueOf();

    const actionObj = jsonObj.getString("action");
    if (actionObj == null) {
      return new Err<Trigger>("Trigger action not specified.");
    }
    const action: string = actionObj.valueOf();

    return new Ok<Trigger>(new Trigger(type, action));
  }

  /**
   * Serializes the Trigger instance to a JSON string.
   * @returns A JSON string representing the Trigger.
   */
  toJSON(): string {
    return `{ "type": "${escapeString(this.type)}", "action": "${escapeString(
      this.action
    )}" }`;
  }
}

// Effect.ts

/**
 * Represents an effect of an event.
 */
export class Effect {
  type: string;
  parameters: JSON.Obj | null;

  constructor(type: string, parameters: JSON.Obj | null) {
    this.type = type;
    this.parameters = parameters;
  }

  /**
   * Factory method to create an Effect instance from a JSON object.
   * @param jsonObj - The JSON object representing an Effect.
   * @returns A Result containing either a new Effect instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<Effect> {
    if (jsonObj == null) {
      return new Err<Effect>("Invalid data for Effect: JSON object is null.");
    }

    const typeObj = jsonObj.getString("type");
    if (typeObj == null) {
      return new Err<Effect>("Effect type not specified.");
    }
    const type: string = typeObj.valueOf();

    const parametersObj = jsonObj.getObj("parameters");
    // Parameters can be optional or empty
    return new Ok<Effect>(new Effect(type, parametersObj));
  }

  /**
   * Serializes the Effect instance to a JSON string.
   * @returns A JSON string representing the Effect.
   */
  toJSON(): string {
    let parametersJson =
      this.parameters != null ? this.parameters.toString() : "{}";
    return `{ "type": "${escapeString(
      this.type
    )}", "parameters": ${parametersJson} }`;
  }
}

// Condition.ts

/**
 * Represents a condition for an event.
 */
export class Condition {
  type: string;
  parameters: JSON.Obj | null;

  constructor(type: string, parameters: JSON.Obj | null) {
    this.type = type;
    this.parameters = parameters;
  }

  /**
   * Factory method to create a Condition instance from a JSON object.
   * @param jsonObj - The JSON object representing a Condition.
   * @returns A Result containing either a new Condition instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<Condition> {
    if (jsonObj == null) {
      return new Err<Condition>(
        "Invalid data for Condition: JSON object is null."
      );
    }

    const typeObj = jsonObj.getString("type");
    if (typeObj == null) {
      return new Err<Condition>("Condition type not specified.");
    }
    const type: string = typeObj.valueOf();

    const parametersObj = jsonObj.getObj("parameters");
    // Parameters can be optional or empty
    return new Ok<Condition>(new Condition(type, parametersObj));
  }

  /**
   * Serializes the Condition instance to a JSON string.
   * @returns A JSON string representing the Condition.
   */
  toJSON(): string {
    let parametersJson =
      this.parameters != null ? this.parameters.toString() : "{}";
    return `{ "type": "${escapeString(
      this.type
    )}", "parameters": ${parametersJson} }`;
  }
}

// AppliesTo.ts

/**
 * Represents the target of an event.
 */
export class AppliesTo {
  index: u8;
  name: string;
  subProperties: SubProperty[] | null;

  constructor(index: u8, name: string, subProperties: SubProperty[] | null) {
    this.index = index;
    this.name = name;
    this.subProperties = subProperties;
  }

  /**
   * Factory method to create an AppliesTo instance from a JSON object.
   * @param jsonObj - The JSON object representing an AppliesTo.
   * @returns A Result containing either a new AppliesTo instance or an error message.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<AppliesTo> {
    if (jsonObj == null) {
      return new Err<AppliesTo>("Invalid data for AppliesTo: JSON object is null.");
    }

    // Parse 'index'
    const indexResult: Result<u8> = getSafeU8(jsonObj, "index", "AppliesTo");
    const errorIndexResult: Err<u8> | null = castErr<u8>(indexResult);
    if (errorIndexResult != null) {
      return new Err<AppliesTo>(errorIndexResult.error);
    }

    const okIndexResult: Ok<u8> | null = castOk<u8>(indexResult);
    if (okIndexResult == null) {
      return new Err<AppliesTo>("Unexpected error parsing 'index' in AppliesTo.");
    }

    const index: u8 = okIndexResult.value;

    // Parse 'name'
    const nameResult: Result<string> = getSafeString(jsonObj, "name", "AppliesTo");
    const errorNameResult: Err<string> | null = castErr<string>(nameResult);
    if (errorNameResult != null) {
      return new Err<AppliesTo>(errorNameResult.error);
    }

    const okNameResult: Ok<string> | null = castOk<string>(nameResult);
    if (okNameResult == null) {
      return new Err<AppliesTo>("Unexpected error parsing 'name' in AppliesTo.");
    }

    const name: string = okNameResult.value;

    // Parse 'subProperties'
    const subPropsValue = jsonObj.get("subProperties");
    let subProperties: SubProperty[] | null = null;

    if (subPropsValue != null) {
      if (!subPropsValue.isArr) {
        return new Err<AppliesTo>(
          "'subProperties' field is not an array in AppliesTo."
        );
      }

      const subPropsArr = subPropsValue as JSON.Arr;
      const subPropsResult: Result<SubProperty[]> = loadArray<SubProperty>(
        subPropsArr,
        (subPropJson: JSON.Obj) => SubProperty.fromJSON(subPropJson),
        "AppliesTo"
      );

      const errorSubPropsResult: Err<SubProperty[]> | null = castErr<SubProperty[]>(subPropsResult);
      if (errorSubPropsResult != null) {
        return new Err<AppliesTo>(errorSubPropsResult.error);
      }

      const okSubPropsResult: Ok<SubProperty[]> | null = castOk<SubProperty[]>(subPropsResult);
      if (okSubPropsResult == null) {
        return new Err<AppliesTo>(
          "Unexpected error parsing 'subProperties' in AppliesTo."
        );
      }

      subProperties = okSubPropsResult.value;
    }

    return new Ok<AppliesTo>(new AppliesTo(index, name, subProperties));
  }

  /**
   * Serializes the AppliesTo instance to a JSON string.
   * @returns A JSON string representing the AppliesTo.
   */
  toJSON(): string {
    let subPropertiesJson = this.subProperties != null ? serializeSubProperties(this.subProperties) : "null";
    return `{ 
      "index": ${this.index}, 
      "name": "${escapeString(this.name)}", 
      "subProperties": ${subPropertiesJson} 
    }`;
  }
}

/**
 * Represents an event in the game.
 */
export class EventDefinition extends GameItemDefinition {
  triggers: Trigger[] | null;
  effects: Effect[] | null;
  conditions: Condition[] | null;
  appliesTo: AppliesTo | null;

  constructor() {
    super();
    this.triggers = null;
    this.effects = null;
    this.conditions = null;
    this.appliesTo = null;
  }

  /**
   * Loads Event-specific properties from JSON.
   * @param jsonObj - The JSON object representing an EventDefinition.
   * @returns A Result indicating success or containing an error message.
   */
  loadSpecificFromJSON(jsonObj: JSON.Obj | null): Result<void> {
    if (jsonObj == null) {
      return new Err<void>(
        "Invalid data for EventDefinition: JSON object is null."
      );
    }

    // Parse 'triggers'
    const triggersValue = jsonObj.get("triggers");
    if (triggersValue == null || !triggersValue.isArr) {
      return new Err<void>(
        "'triggers' field is missing or is not an array in EventDefinition."
      );
    }

    const triggersArr = triggersValue as JSON.Arr;
    const triggersResult: Result<Trigger[]> = loadArray<Trigger>(
      triggersArr,
      (triggerJson: JSON.Obj) => Trigger.fromJSON(triggerJson),
      "EventDefinition.triggers"
    );

    const errorTriggersResult: Err<Trigger[]> | null =
      castErr<Trigger[]>(triggersResult);
    if (errorTriggersResult != null) {
      return new Err<void>(errorTriggersResult.error);
    }

    const okTriggersResult: Ok<Trigger[]> | null =
      castOk<Trigger[]>(triggersResult);
    if (okTriggersResult == null) {
      return new Err<void>(
        "Unexpected error parsing 'triggers' in EventDefinition."
      );
    }

    this.triggers = okTriggersResult.value;

    // Parse 'effects'
    const effectsValue = jsonObj.get("effects");
    if (effectsValue == null || !effectsValue.isArr) {
      return new Err<void>(
        "'effects' field is missing or is not an array in EventDefinition."
      );
    }

    const effectsArr = effectsValue as JSON.Arr;
    const effectsResult: Result<Effect[]> = loadArray<Effect>(
      effectsArr,
      (effectJson: JSON.Obj) => Effect.fromJSON(effectJson),
      "EventDefinition.effects"
    );

    const errorEffectsResult: Err<Effect[]> | null =
      castErr<Effect[]>(effectsResult);
    if (errorEffectsResult != null) {
      return new Err<void>(errorEffectsResult.error);
    }

    const okEffectsResult: Ok<Effect[]> | null =
      castOk<Effect[]>(effectsResult);
    if (okEffectsResult == null) {
      return new Err<void>(
        "Unexpected error parsing 'effects' in EventDefinition."
      );
    }

    this.effects = okEffectsResult.value;

    // Parse 'conditions'
    const conditionsValue = jsonObj.get("conditions");
    if (conditionsValue == null || !conditionsValue.isArr) {
      return new Err<void>(
        "'conditions' field is missing or is not an array in EventDefinition."
      );
    }

    const conditionsArr = conditionsValue as JSON.Arr;
    const conditionsResult: Result<Condition[]> = loadArray<Condition>(
      conditionsArr,
      (conditionJson: JSON.Obj) => Condition.fromJSON(conditionJson),
      "EventDefinition.conditions"
    );

    const errorConditionsResult: Err<Condition[]> | null =
      castErr<Condition[]>(conditionsResult);
    if (errorConditionsResult != null) {
      return new Err<void>(errorConditionsResult.error);
    }

    const okConditionsResult: Ok<Condition[]> | null =
      castOk<Condition[]>(conditionsResult);
    if (okConditionsResult == null) {
      return new Err<void>(
        "Unexpected error parsing 'conditions' in EventDefinition."
      );
    }

    this.conditions = okConditionsResult.value;

    // Parse 'appliesTo'
    const appliesToValue = jsonObj.get("appliesTo");
    if (appliesToValue == null || !appliesToValue.isObj) {
      return new Err<void>(
        "'appliesTo' field is missing or is not an object in EventDefinition."
      );
    }

    const appliesToObj = appliesToValue as JSON.Obj;
    const appliesToResult: Result<AppliesTo> = AppliesTo.fromJSON(appliesToObj);

    const errorAppliesToResult: Err<AppliesTo> | null =
      castErr<AppliesTo>(appliesToResult);
    if (errorAppliesToResult != null) {
      return new Err<void>(errorAppliesToResult.error);
    }

    const okAppliesToResult: Ok<AppliesTo> | null =
      castOk<AppliesTo>(appliesToResult);
    if (okAppliesToResult == null) {
      return new Err<void>(
        "Unexpected error parsing 'appliesTo' in EventDefinition."
      );
    }

    this.appliesTo = okAppliesToResult.value;

    return new OkVoid();
  }

  /**
   * Serializes the EventDefinition instance to a JSON string.
   * @returns A JSON string representing the EventDefinition.
   */
  toJSON(): string {
    let triggersJson = serializeTriggers(this.triggers);
    let effectsJson = serializeEffects(this.effects);
    let conditionsJson = serializeConditions(this.conditions);
    let appliesToJson =
      this.appliesTo != null ? this.appliesTo.toJSON() : "null";
    let defaultsJson = `{ "required": ${this.defaults.required}, "growth": "${
      GrowthTypeString[this.defaults.growth]
    }" }`;
    let propertiesJson = serializeSubProperties(this.properties);

    return `{ 
      "index": ${this.index}, 
      "name": "${escapeString(this.name)}", 
      "description": "${escapeString(this.description)}", 
      "defaults": ${defaultsJson},
      "triggers": ${triggersJson},
      "effects": ${effectsJson},
      "conditions": ${conditionsJson},
      "appliesTo": ${appliesToJson},
      "properties": ${propertiesJson}
    }`;
  }
}

/**
 * Serializes an array of Trigger objects to a JSON string.
 * @param triggers - The array of Trigger objects.
 * @returns A JSON string representing the array.
 */
function serializeTriggers(triggers: Trigger[] | null): string {
  if (triggers == null) return "null";
  let jsonStr = "[";
  for (let i = 0; i < triggers.length; i++) {
    jsonStr += triggers[i].toJSON();
    if (i < triggers.length - 1) jsonStr += ",";
  }
  jsonStr += "]";
  return jsonStr;
}

/**
 * Serializes an array of Effect objects to a JSON string.
 * @param effects - The array of Effect objects.
 * @returns A JSON string representing the array.
 */
function serializeEffects(effects: Effect[] | null): string {
  if (effects == null) return "null";
  let jsonStr = "[";
  for (let i = 0; i < effects.length; i++) {
    jsonStr += effects[i].toJSON();
    if (i < effects.length - 1) jsonStr += ",";
  }
  jsonStr += "]";
  return jsonStr;
}

/**
 * Serializes an array of Condition objects to a JSON string.
 * @param conditions - The array of Condition objects.
 * @returns A JSON string representing the array.
 */
function serializeConditions(conditions: Condition[] | null): string {
  if (conditions == null) return "null";
  let jsonStr = "[";
  for (let i = 0; i < conditions.length; i++) {
    jsonStr += conditions[i].toJSON();
    if (i < conditions.length - 1) jsonStr += ",";
  }
  jsonStr += "]";
  return jsonStr;
}

/**
 * Maps a string to the corresponding GrowthTypeIndex enum.
 * @param growth - The growth type as a string.
 * @returns A Result containing the GrowthTypeIndex or an error message.
 */
function mapStringToGrowthType(growth: string): Result<GrowthTypeIndex> {
  for (let i: i32 = 0; i < GrowthTypeString.length; i++) {
    if (GrowthTypeString[i] == growth) {
      return new Ok<GrowthTypeIndex>(<GrowthTypeIndex>i);
    }
  }
  return new Err<GrowthTypeIndex>(`Invalid 'growth' value '${growth}'.`);
}

/**
 * Serializes an array of SubProperty objects to a JSON string.
 * @param props - The array of SubProperty objects.
 * @returns A JSON string representing the array.
 */
function serializeSubProperties(props: SubProperty[] | null): string {
  if (props == null) return "null";
  let jsonStr = "[";
  for (let i = 0; i < props.length; i++) {
    jsonStr += props[i].toJSON(); // Now valid since toJSON is implemented
    if (i < props.length - 1) jsonStr += ",";
  }
  jsonStr += "]";
  return jsonStr;
}

/**
 * Creates a GameItemDefinition instance from a JSON string.
 * @param jsonPtr - Pointer to the JSON string in WebAssembly memory.
 * @returns Pointer to the resulting JSON string (Result object).
 */
export function createGameItemDefinition(jsonPtr: usize): usize {
  // Convert the pointer to a string using the AssemblyScript helper
  let jsonStr = __getString(jsonPtr);

  // Parse the JSON string into a JSON.Value
  let jsonValue: JSON.Value = JSON.parse(jsonStr);

  // Check if the parsed value is a JSON.Obj
  if (!jsonValue.isObj) {
    // Construct an error Result as a JSON string
    let errorJson = `{ "isOk": false, "error": "${escapeString(
      "Parsed JSON is not an object."
    )}" }`;
    return __newString(errorJson, true);
  }

  // Cast JSON.Value to JSON.Obj since we've confirmed it's an object
  let jsonObj = changetype<JSON.Obj>(jsonValue);

  // Use the factory method to create a GameItemDefinition
  let result: Result<GameItemDefinition> = GameItemDefinition.fromJSON(jsonObj);

  // Initialize a variable to hold the serialized Result JSON string
  let resultJson: string;

  // Attempt to cast the result to Ok<GameItemDefinition>
  let okResult = castOk<GameItemDefinition>(result);
  if (okResult != null) {
    // Access the value from the Ok result
    let value = okResult.value;

    // Serialize the GameItemDefinition instance to JSON using its toJSON method
    resultJson = `{ "isOk": true, "value": ${value.toJSON()} }`;
  } else {
    // Attempt to cast the result to Err<GameItemDefinition>
    let errResult = castErr<GameItemDefinition>(result);
    if (errResult != null) {
      // Access the error message from the Err result
      let error = errResult.error;

      // Serialize the error into JSON
      let escapedError = escapeString(error);
      resultJson = `{ "isOk": false, "error": "${escapedError}" }`;
    } else {
      // Handle unexpected Result type
      let errorJson = `{ "isOk": false, "error": "${escapeString(
        "Unknown result type."
      )}" }`;
      return __newString(errorJson, true);
    }
  }

  // Allocate memory for the result JSON string and return its pointer
  return __newString(resultJson, true);
}

/**
 * Escapes special characters in a string to ensure valid JSON formatting.
 * @param str - The input string to escape.
 * @returns The escaped string.
 */
function escapeString(str: string): string {
  let escaped = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i); // Get the numeric Unicode code point
    switch (charCode) {
      case 92: // '\\'
        escaped += "\\\\";
        break;
      case 34: // '"'
        escaped += '\\"';
        break;
      case 8: // '\b'
        escaped += "\\b";
        break;
      case 12: // '\f'
        escaped += "\\f";
        break;
      case 10: // '\n'
        escaped += "\\n";
        break;
      case 13: // '\r'
        escaped += "\\r";
        break;
      case 9: // '\t'
        escaped += "\\t";
        break;
      default:
        if (charCode < 0x20) {
          // Unicode escape for control characters
          escaped += "\\u" + charCode.toString(16).padStart(4, "0");
        } else {
          escaped += String.fromCharCode(charCode);
        }
    }
  }
  return escaped;
}
/*
 * @returns The string.
 */
declare function __getString(ptr: usize): string;

/**
 * Allocates memory for a string and returns its pointer.
 * @param str - The string to allocate.
 * @param follow - Whether to follow the string reference.
 * @returns Pointer to the allocated string.
 */
declare function __newString(str: string, follow: bool): usize;
