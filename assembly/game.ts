// Game.ts
import { JSON } from "assemblyscript-json/assembly";
import { Level } from "./Level";
import { EventDefinitions } from "./Event";
import {
  Appearance,
  AppearanceDefinitions
} from "./Appearance";
import { Characteristic, CharacteristicDefinitions } from "./Characteristics";
import { Behaviour, BehaviourDefinitions } from "./Behaviours";
import { Character } from "./Character";
import { SpriteTypeIndex } from "./Enumerations";

export class Game {
  level: Level;
  playerCharacter: Character;
  playerAppearance: Appearance;
  playerCharacteristics: Characteristic[];
  playerBehaviours: Behaviour[];
  appearanceDefinitions: AppearanceDefinitions;
  characteristicDefinitions: CharacteristicDefinitions;
  behaviourDefinitions: BehaviourDefinitions;
  eventDefinitions: EventDefinitions;

  constructor(
    levelWidth: i32,
    levelHeight: i32,
    playerCharacter: Character,
    playerAppearance: Appearance,
    playerCharacteristics: Characteristic[],
    playerBehaviours: Behaviour[],
    appearanceDefinitions: AppearanceDefinitions,
    characteristicDefinitions: CharacteristicDefinitions,
    behaviourDefinitions: BehaviourDefinitions,
    eventDefinitions: EventDefinitions
  ) {
    this.level = new Level(levelWidth, levelHeight);
    this.playerCharacter = playerCharacter;
    this.playerAppearance = playerAppearance;
    this.playerCharacteristics = playerCharacteristics;
    this.playerBehaviours = playerBehaviours;
    this.appearanceDefinitions = appearanceDefinitions;
    this.characteristicDefinitions = characteristicDefinitions;
    this.behaviourDefinitions = behaviourDefinitions;
    this.eventDefinitions = eventDefinitions;
  }

  // build the game
  start(): void {
    // build the level
    // provide the 
    // add the character to the level
  }

  // poll the current state of the game
  poll(): void {}

  // save the current state of the game to a photo
  save(): void {}
}

export function initializeGame(
  width: i32,
  height: i32,
  playerAppearanceJSON: string,
  playerCharacteristicsJSON: string,
  playerBehavioursJSON: string,
  appearanceDefinitionsJSON: string,
  characteristicDefinitionsJSON: string,
  behaviourDefinitionsJSON: string,
  eventDefinitionsJSON: string
): void {
  // Parse JSON strings into JSON.Obj
  let playerAppearanceValue = <JSON.Obj>JSON.parse(playerAppearanceJSON);
  let playerCharacteristicsValue = <JSON.Obj>(
    JSON.parse(playerCharacteristicsJSON)
  );
  let playerBehavioursValue = <JSON.Obj>JSON.parse(playerBehavioursJSON);
  let appearanceDefinitionsValue = <JSON.Obj>(
    JSON.parse(appearanceDefinitionsJSON)
  );
  let characteristicDefinitionsValue = <JSON.Obj>(
    JSON.parse(characteristicDefinitionsJSON)
  );
  let behaviourDefinitionsValue = <JSON.Obj>(
    JSON.parse(behaviourDefinitionsJSON)
  );
  let eventDefinitionsValue = <JSON.Obj>JSON.parse(eventDefinitionsJSON);

  // Load definitions from JSON values using the updated static fromJSON methods
  let appearanceDefinitions = AppearanceDefinitions.fromJSON(
    appearanceDefinitionsValue
  );
  let characteristicDefinitions = CharacteristicDefinitions.fromJSON(
    characteristicDefinitionsValue
  );
  let behaviourDefinitions = BehaviourDefinitions.fromJSON(
    behaviourDefinitionsValue
  );
  let eventDefinitions = EventDefinitions.fromJSON(eventDefinitionsValue);

  // Initialize player appearance
  let playerAppearance = Appearance.fromJSON(
    playerAppearanceValue,
    appearanceDefinitions
  );

  // Initialize player characteristics
  let playerCharacteristics = Characteristic.fromJSON(
    playerCharacteristicsValue,
    characteristicDefinitions
  );

  // Initialize player behaviours
  let playerBehaviours = Behaviour.fromJSON(
    playerBehavioursValue,
    behaviourDefinitions
  );

  // Initialize the game
  let game = new Game(
    width,
    height,
    new Character(SpriteTypeIndex.Self),
    playerAppearance,
    playerCharacteristics,
    playerBehaviours,
    appearanceDefinitions,
    characteristicDefinitions,
    behaviourDefinitions,
    eventDefinitions
  );

  game.start();
}
