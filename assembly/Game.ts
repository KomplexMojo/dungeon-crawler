// Game.ts
import { JSON } from "assemblyscript-json/assembly";
import { Level } from "./Level";
import { Character } from "./Character";
import { SpriteTypeIndex } from "./Enumerations";

export class Game {
  level: Level;
  playerCharacter: Character;


  constructor(
    levelWidth: i32,
    levelHeight: i32,
    playerCharacter: Character,

  ) {
    this.level = new Level(levelWidth, levelHeight);
    this.playerCharacter = playerCharacter;
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
): void {

  // Initialize the game
  let game = new Game(
    width,
    height,
    new Character(SpriteTypeIndex.Self),
  );

  game.start();
}
