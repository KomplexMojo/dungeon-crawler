import { Result, Ok, Err } from "./Result";
import { getSafeU8, getSafeString } from "./JSONUtils";
import { SubProperty } from "./SubProperty";
import { JSON } from "assemblyscript-json/assembly";

// ---------------------------------------------
// EventDefinition Class
// ---------------------------------------------
export class EventDefinition {
  index: number;
  eventName: string;
  description: string;
  triggers: Trigger[];
  effects: Effect[];
  conditions: Condition[];
  appliesTo: AppliesTo;

  constructor(
    index: number,
    eventName: string,
    description: string,
    triggers: Trigger[] = [],
    effects: Effect[] = [],
    conditions: Condition[] = [],
    appliesTo: AppliesTo = new AppliesTo(0, "", [])
  ) {
    this.index = index;
    this.eventName = eventName;
    this.description = description;
    this.triggers = triggers;
    this.effects = effects;
    this.conditions = conditions;
    this.appliesTo = appliesTo;
  }

  /**
   * Factory method to create an EventDefinition instance from a JSON object.
   * @param jsonObj - The JSON object representing an EventDefinition.
   * @returns A Result containing the EventDefinition or an Err.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<EventDefinition> {
    if (jsonObj == null) {
      return new Err<EventDefinition>("Invalid data for EventDefinition.");
    }

    // Retrieve the index, eventName, and description safely
    const indexResult = getSafeU8(jsonObj, "index", "EventDefinition");
    if (indexResult.isErr()) return indexResult as Err<EventDefinition>;
    const index = (indexResult as Ok<u8>).value;

    const eventNameResult = getSafeString(jsonObj, "name", "EventDefinition");
    if (eventNameResult.isErr()) return eventNameResult as Err<EventDefinition>;
    const eventName = (eventNameResult as Ok<string>).value;

    const descriptionResult = getSafeString(
      jsonObj,
      "description",
      "EventDefinition"
    );
    if (descriptionResult.isErr())
      return descriptionResult as Err<EventDefinition>;
    const description = (descriptionResult as Ok<string>).value;

    // Load triggers
    const triggersArr = jsonObj.getArr("triggers");
    const triggers = new Array<Trigger>();
    if (triggersArr != null) {
      const triggersData = triggersArr.valueOf();
      for (let i = 0; i < triggersData.length; i++) {
        const triggerValue = triggersData[i];

        // Check if the trigger is an object before attempting to parse
        if (triggerValue.isObj) {
          const triggerObj = triggerValue as JSON.Obj;
          const triggerResult = Trigger.fromJSON(triggerObj);

          if (triggerResult.isErr()) {
            return triggerResult as Err<EventDefinition>;
          }

          triggers.push((triggerResult as Ok<Trigger>).value);
        } else {
          return new Err<EventDefinition>(
            `Invalid trigger type at index ${i}. Expected an object.`
          );
        }
      }
    }

    // Load effects
    const effectsArr = jsonObj.getArr("effects");
    const effects = new Array<Effect>();
    if (effectsArr != null) {
      const effectsData = effectsArr.valueOf();
      for (let i = 0; i < effectsData.length; i++) {
        const effectValue = effectsData[i];

        // Check if the effect is an object before attempting to parse
        if (effectValue.isObj) {
          const effectObj = effectValue as JSON.Obj;
          const effectResult = Effect.fromJSON(effectObj);

          if (effectResult.isErr()) {
            return effectResult as Err<EventDefinition>;
          }

          effects.push((effectResult as Ok<Effect>).value);
        } else {
          return new Err<EventDefinition>(
            `Invalid effect type at index ${i}. Expected an object.`
          );
        }
      }
    }

    // Load conditions
    const conditionsArr = jsonObj.getArr("conditions");
    const conditions = new Array<Condition>();
    if (conditionsArr != null) {
      const conditionsData = conditionsArr.valueOf();
      for (let i = 0; i < conditionsData.length; i++) {
        const conditionValue = conditionsData[i];

        // Check if the condition is an object before attempting to parse
        if (conditionValue.isObj) {
          const conditionObj = conditionValue as JSON.Obj;
          const conditionResult = Condition.fromJSON(conditionObj);

          if (conditionResult.isErr()) {
            return conditionResult as Err<EventDefinition>;
          }

          conditions.push((conditionResult as Ok<Condition>).value);
        } else {
          return new Err<EventDefinition>(
            `Invalid condition type at index ${i}. Expected an object.`
          );
        }
      }
    }

    // Load appliesTo
    const appliesToResult = AppliesTo.fromJSON(jsonObj.getObj("appliesTo"));
    if (appliesToResult.isErr()) {
      return appliesToResult as Err<EventDefinition>;
    }

    return new Ok<EventDefinition>(
      new EventDefinition(
        index,
        eventName,
        description,
        triggers,
        effects,
        conditions,
        (appliesToResult as Ok<AppliesTo>).value
      )
    );
  }

  /**
   * Retrieves a Trigger by its index.
   * @param index - The index of the trigger to retrieve.
   * @returns A Result containing the Trigger or an Err.
   */
  getTriggerByIndex(index: number): Result<Trigger> {
    if (index >= 0 && index < this.triggers.length) {
      return new Ok<Trigger>(this.triggers[index]);
    }
    return new Err<Trigger>(`Trigger with index ${index} not found.`);
  }
}

// ---------------------------------------------
// AppliesTo Class
// ---------------------------------------------
export class AppliesTo {
  index: number;
  name: string;
  subProperties: SubProperty[];

  constructor(index: number, name: string, subProperties: SubProperty[] = []) {
    this.index = index;
    this.name = name;
    this.subProperties = subProperties;
  }

  /**
   * Factory method to create an AppliesTo instance from a JSON object.
   * @param jsonObj - The JSON object representing an AppliesTo.
   * @returns A Result containing the AppliesTo or an Err.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<AppliesTo> {
    if (jsonObj == null) {
      return new Err<AppliesTo>("Invalid data for AppliesTo.");
    }

    // Safely retrieve the index and name
    const indexResult = getSafeU8(jsonObj, "index", "AppliesTo");
    if (indexResult.isErr()) return indexResult as Err<AppliesTo>;
    const index = (indexResult as Ok<u8>).value;

    const nameResult = getSafeString(jsonObj, "name", "AppliesTo");
    if (nameResult.isErr()) return nameResult as Err<AppliesTo>;
    const name = (nameResult as Ok<string>).value;

    // Load subProperties
    const subPropertiesArr = jsonObj.getArr("subProperties");
    const subProperties = new Array<SubProperty>();
    if (subPropertiesArr != null) {
      const subPropertiesData = subPropertiesArr.valueOf();
      for (let i = 0; i < subPropertiesData.length; i++) {
        const subPropertyValue = subPropertiesData[i];

        // Check if the sub-property is an object before attempting to parse
        if (subPropertyValue.isObj) {
          const subPropertyObj = subPropertyValue as JSON.Obj;
          const subPropResult = SubProperty.fromJSON(subPropertyObj);

          if (subPropResult.isErr()) {
            return subPropResult as Err<AppliesTo>;
          }

          subProperties.push((subPropResult as Ok<SubProperty>).value);
        } else {
          return new Err<AppliesTo>(
            `Invalid sub-property type at index ${i}. Expected an object.`
          );
        }
      }
    }

    return new Ok<AppliesTo>(new AppliesTo(index, name, subProperties));
  }
}

// ---------------------------------------------
// Trigger Class
// ---------------------------------------------
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
   * @returns A Result containing the Trigger or an Err.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<Trigger> {
    if (jsonObj == null) {
      return new Err<Trigger>("Invalid data for Trigger.");
    }

    const typeResult = getSafeString(jsonObj, "type", "Trigger");
    if (typeResult.isErr()) return typeResult as Err<Trigger>;
    const type = (typeResult as Ok<string>).value;

    const actionResult = getSafeString(jsonObj, "action", "Trigger");
    if (actionResult.isErr()) return actionResult as Err<Trigger>;
    const action = (actionResult as Ok<string>).value;

    return new Ok<Trigger>(new Trigger(type, action));
  }
}

// ---------------------------------------------
// Effect Class
// ---------------------------------------------
export class Effect {
  type: string;
  parameters: JSON.Obj; // Using JSON.Obj to store key-value pairs

  constructor(type: string, parameters: JSON.Obj = new JSON.Obj()) {
    this.type = type;
    this.parameters = parameters;
  }

  /**
   * Factory method to create an Effect instance from a JSON object.
   * @param jsonObj - The JSON object representing an Effect.
   * @returns A Result containing the Effect or an Err.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<Effect> {
    if (jsonObj == null) {
      return new Err<Effect>("Invalid JSON data for Effect.");
    }

    // Safely get the 'type' field
    const typeResult = getSafeString(jsonObj, "type", "Effect");
    if (typeResult.isErr()) return typeResult as Err<Effect>;
    const type = (typeResult as Ok<string>).value;

    // Safely get the 'parameters' field as a JSON.Obj
    const parametersResult = jsonObj.getObj("parameters");
    const parameters =
      parametersResult != null ? parametersResult : new JSON.Obj();

    return new Ok<Effect>(new Effect(type, parameters));
  }

  /**
   * Retrieves a parameter by key.
   * @param key - The key of the parameter.
   * @returns The value as a string or null if not found.
   */
  getParameter(key: string): string | null {
    const param = this.parameters.getString(key);
    return param != null ? param.valueOf() : null;
  }
}

// ---------------------------------------------
// Condition Class
// ---------------------------------------------
export class Condition {
  type: string;
  parameters: JSON.Obj; // Using JSON.Obj for parameters

  constructor(type: string, parameters: JSON.Obj = new JSON.Obj()) {
    this.type = type;
    this.parameters = parameters;
  }

  /**
   * Factory method to create a Condition instance from a JSON object.
   * @param jsonObj - The JSON object representing a Condition.
   * @returns A Result containing the Condition or an Err.
   */
  static fromJSON(jsonObj: JSON.Obj | null): Result<Condition> {
    if (jsonObj == null) {
      return new Err<Condition>("Invalid data for Condition.");
    }

    // Safely get the 'type' field
    const typeResult = getSafeString(jsonObj, "type", "Condition");
    if (typeResult.isErr()) return typeResult as Err<Condition>;
    const type = (typeResult as Ok<string>).value;

    // Safely get the 'parameters' field as a JSON.Obj
    const parametersResult = jsonObj.getObj("parameters");
    const parameters =
      parametersResult != null ? parametersResult : new JSON.Obj();

    return new Ok<Condition>(new Condition(type, parameters));
  }
}
