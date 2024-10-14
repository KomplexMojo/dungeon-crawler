import { Result, Ok, Err } from "./Result";
import { getSafeBoolean, getSafeU8, getSafeString } from "./JSONUtils";

// EventDefinition.ts
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
   * @param data - The JSON object representing an EventDefinition.
   * @returns A Result containing the EventDefinition or an Err.
   */
  static fromJSON(data: any): Result<EventDefinition> {
    if (!data) {
      return new Err<EventDefinition>("Invalid data for EventDefinition.");
    }

    // Retrieve the index, eventName, and description safely
    const indexResult = getSafeU8(data, "index", "EventDefinition");
    if (indexResult.isErr()) return new Err<EventDefinition>(indexResult.error);
    const index = indexResult.value;

    const eventNameResult = getSafeString(data, "name", "EventDefinition");
    if (eventNameResult.isErr())
      return new Err<EventDefinition>(eventNameResult.error);
    const eventName = eventNameResult.value;

    const descriptionResult = getSafeString(
      data,
      "description",
      "EventDefinition"
    );
    if (descriptionResult.isErr())
      return new Err<EventDefinition>(descriptionResult.error);
    const description = descriptionResult.value;

    // Load triggers
    const triggersData = data.triggers || [];
    const triggers = new Array<Trigger>();
    for (let i = 0; i < triggersData.length; i++) {
      const triggerResult = Trigger.fromJSON(triggersData[i]);
      if (triggerResult.isErr()) {
        return new Err<EventDefinition>(triggerResult.error);
      }
      triggers.push(triggerResult.value);
    }

    // Load effects
    const effectsData = data.effects || [];
    const effects = new Array<Effect>();
    for (let i = 0; i < effectsData.length; i++) {
      const effectResult = Effect.fromJSON(effectsData[i]);
      if (effectResult.isErr()) {
        return new Err<EventDefinition>(effectResult.error);
      }
      effects.push(effectResult.value);
    }

    // Load conditions
    const conditionsData = data.conditions || [];
    const conditions = new Array<Condition>();
    for (let i = 0; i < conditionsData.length; i++) {
      const conditionResult = Condition.fromJSON(conditionsData[i]);
      if (conditionResult.isErr()) {
        return new Err<EventDefinition>(conditionResult.error);
      }
      conditions.push(conditionResult.value);
    }

    // Load appliesTo
    const appliesToResult = AppliesTo.fromJSON(data.appliesTo);
    if (appliesToResult.isErr()) {
      return new Err<EventDefinition>(appliesToResult.error);
    }

    return new Ok<EventDefinition>(
      new EventDefinition(
        index,
        eventName,
        description,
        triggers,
        effects,
        conditions,
        appliesToResult.value
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

// AppliesTo.ts
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
   * @param data - The JSON object representing an AppliesTo.
   * @returns A Result containing the AppliesTo or an Err.
   */
  static fromJSON(data: any): Result<AppliesTo> {
    if (!data) {
      return new Err<AppliesTo>("Invalid data for AppliesTo.");
    }

    // Safely retrieve the index and name
    const indexResult = getSafeU8(data, "index", "AppliesTo");
    if (indexResult.isErr()) return new Err<AppliesTo>(indexResult.error);
    const index = indexResult.value;

    const nameResult = getSafeString(data, "name", "AppliesTo");
    if (nameResult.isErr()) return new Err<AppliesTo>(nameResult.error);
    const name = nameResult.value;

    // Load subProperties
    const subPropertiesData = data.subProperties || [];
    const subProperties = new Array<SubProperty>();

    for (let i = 0; i < subPropertiesData.length; i++) {
      const subPropResult = SubProperty.fromJSON(subPropertiesData[i]);
      if (subPropResult.isErr()) {
        return new Err<AppliesTo>(subPropResult.error);
      }
      subProperties.push(subPropResult.value);
    }

    return new Ok<AppliesTo>(new AppliesTo(index, name, subProperties));
  }
}

// Trigger.ts (Similar changes)
export class Trigger {
  type: string;
  action: string;

  constructor(type: string, action: string) {
    this.type = type;
    this.action = action;
  }

  /**
   * Factory method to create a Trigger instance from a JSON object.
   * @param data - The JSON object representing a Trigger.
   * @returns A Result containing the Trigger or an Err.
   */
  static fromJSON(data: any): Result<Trigger> {
    if (!data) {
      return new Err<Trigger>("Invalid data for Trigger.");
    }
    const typeResult = getSafeString(data, "type", "Trigger");
    if (typeResult.isErr()) return new Err<Trigger>(typeResult.error);

    const actionResult = getSafeString(data, "action", "Trigger");
    if (actionResult.isErr()) return new Err<Trigger>(actionResult.error);

    return new Ok<Trigger>(new Trigger(typeResult.value, actionResult.value));
  }
}

// Effect.ts
export class Effect {
  type: string;
  parameters: Map<string, any>;

  constructor(
    type: string,
    parameters: Map<string, any> = new Map<string, any>()
  ) {
    this.type = type;
    this.parameters = parameters;
  }

  /**
   * Factory method to create an Effect instance from a plain object.
   * @param data - The plain object representing an Effect.
   * @returns A Result containing the Effect or an Err.
   */
  static fromJSON(data: any): Result<Effect> {
    if (!data) {
      return new Err<Effect>("Invalid data for Effect.");
    }
    const type = data.type || "";
    const parametersData = data.parameters || {};
    const parameters = new Map<string, any>();

    // Iterating over parametersData keys
    const keys = Object.keys(parametersData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (parametersData.hasOwnProperty(key)) {
        parameters.set(key, parametersData[key]);
      }
    }

    return new Ok<Effect>(new Effect(type, parameters));
  }
}

// Condition.ts
export class Condition {
  type: string;
  parameters: Map<string, any>;

  constructor(
    type: string,
    parameters: Map<string, any> = new Map<string, any>()
  ) {
    this.type = type;
    this.parameters = parameters;
  }

  /**
   * Factory method to create a Condition instance from a plain object.
   * @param data - The plain object representing a Condition.
   * @returns A Result containing the Condition or an Err.
   */
  static fromJSON(data: any): Result<Condition> {
    if (!data) {
      return new Err<Condition>("Invalid data for Condition.");
    }
    const type = data.type || "";
    const parametersData = data.parameters || {};
    const parameters = new Map<string, any>();

    // Iterating over parametersData keys
    const keys = Object.keys(parametersData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (parametersData.hasOwnProperty(key)) {
        parameters.set(key, parametersData[key]);
      }
    }

    return new Ok<Condition>(new Condition(type, parameters));
  }
}

