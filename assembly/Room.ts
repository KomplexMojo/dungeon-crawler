import { Character } from "./Character";
import { Item } from "./Item";
import { Sprite } from "./Sprite";
import { Property } from "./Property";
import {
  CharacterTypeIndex,
  SpriteTypeIndex,
  PropertyTypeIndex,
} from "./Enumerations";
import { AppearanceDefinition } from "./Appearance";
import { Quadrilateral } from "./Quadrilateral";
import { DEFAULT_BLOCK_SIZE } from "./Constants";
import { Door } from "./Door";

export class Room extends Quadrilateral<u16> {
  iSprites: Array<Array<Sprite>>; // 2D array to hold sprites within the room
  appearance: Array<AppearanceDefinition>; // Array to hold appearance mapped by SpriteTypeIndex
  wallCharacteristics: Array<Property>;
  floorCharacteristics: Array<Property>;
  doorCharacteristics: Array<Property>;
  maxSpriteCountAcross: u16;
  maxSpriteCountDown: u16;

  constructor(
    topLeftX: u16,
    topLeftY: u16,
    bottomRightX: u16,
    bottomRightY: u16,
    appearance: Array<AppearanceDefinition>,
    wallCharacteristics: Array<Property>,
    floorCharacteristics: Array<Property>,
    doorCharacteristics: Array<Property>
  ) {
    super(topLeftX, topLeftY, bottomRightX, bottomRightY);
    this.appearance = appearance;
    this.wallCharacteristics = wallCharacteristics;
    this.floorCharacteristics = floorCharacteristics;
    this.doorCharacteristics = doorCharacteristics;

    // Initialize the max counts when the room is created
    this.maxSpriteCountAcross = this.getWidthInBlocks();
    this.maxSpriteCountDown = this.getHeightInBlocks();

    this.iSprites = this.initializeSpriteGrid();
  }

  initializeSpriteGrid(): Array<Array<Sprite>> {
    const grid: Array<Array<Sprite>> = new Array<Array<Sprite>>(
      this.maxSpriteCountAcross
    );
    for (let col = 0; col < this.maxSpriteCountAcross; col++) {
      grid[col] = new Array<Sprite>(this.maxSpriteCountDown);
      for (let row = 0; row < this.maxSpriteCountDown; row++) {
        // Initialize each tile as a Floor sprite
        const absoluteTopLeftX = this.topLeftX + col * <u16>DEFAULT_BLOCK_SIZE;
        const absoluteTopLeftY = this.topLeftY + row * <u16>DEFAULT_BLOCK_SIZE;

        // Create a Floor sprite for each tile
        const floorSprite = new Sprite(
          SpriteTypeIndex.Floor,
          absoluteTopLeftX,
          absoluteTopLeftY,
          this.appearance[SpriteTypeIndex.Floor] // Fetch visualization for Floor sprite
        );

        // Set the floor sprite in the grid
        this.addSprite(floorSprite, row, col);
      }
    }
    return grid;
  }

  isValidDimensionInPixels(): bool {
    const minRoomSideDimension = DEFAULT_BLOCK_SIZE * 2; // Minimum room size: 2x2 floor sprites

    // Check if the room width and height meet the minimum requirement
    return (
      this.getWidthInPixels() >= minRoomSideDimension &&
      this.getHeightInPixels() >= minRoomSideDimension
    );
  }

  // Add a sprite to a specific location in the room grid
  addSprite(sprite: Sprite, row: u16, col: u16): bool {
    // Ensure the row and column are within the bounds of the grid
    if (row < this.maxSpriteCountDown && col < this.maxSpriteCountAcross) {
      // Replace the existing sprite at the specified row and column with the new sprite
      this.iSprites[col][row] = sprite;
      return true; // Return true to indicate successful placement
    } else {
      console.log(`Invalid location: (${row}, ${col}) is out of bounds.`);
      return false; // Return false if the location is out of bounds
    }
  }

  // Main method to build the room in the appropriate order
  setupStaticRoomElements(): void {
    // Step 1: Build walls and doors
    this.buildWallsAndDoors();

    // Step 2: Place pillars and traps
    this.placePillarsAndTraps();
  }

  setupItemsInRoom(Items: Array<Item>): void {
    // Step 3: Place items
    this.placeRandomItems();
  }

  configureNPC(NPCs: Array<Character>): void {
    // Step 4: Place non-player characters (NPCs - Adversaries and Neutrals)
    this.placeRandomCharacters(CharacterTypeIndex.Adversary, 2); // 2 adversaries
    this.placeRandomCharacters(CharacterTypeIndex.Neutral, 2); // 2 neutrals
  }

  configurePCC(Self: Character): void {
    // Step 5: Place the player-controlled character (Self)
    this.placePlayerControlledCharacter();
  }

  // Build walls and doors
  buildWallsAndDoors(): void {
    this.buildWalls(this.appearance);
    this.addDoor(0, 2, this.doorCharacteristics); // Example: top wall
    this.addDoor(this.maxSpriteCountDown - 1, 3, this.doorCharacteristics); // Example: bottom wall
  }

  buildWalls(appearances: AppearanceDefinition[]): void {
    for (let col: u16 = 0; col < this.maxSpriteCountAcross; col++) {
      for (let row: u16 = 0; row < this.maxSpriteCountDown; row++) {
        // Get the sprite type based on the position in the room
        const spriteType = this.getSpriteTypeAtPosition(row, col);

        // Calculate the absolute pixel positions based on the column and row
        const absoluteTopLeftX = this.topLeftX + col * <u16>DEFAULT_BLOCK_SIZE;
        const absoluteTopLeftY = this.topLeftY + row * <u16>DEFAULT_BLOCK_SIZE;

        // Fetch the correct appearance for the sprite type from the provided array of appearances
        const appearance: AppearanceDefinition = appearances[spriteType];

        // Create the sprite with the determined type, position, and appearance object
        const sprite = new Sprite(
          spriteType,
          absoluteTopLeftX,
          absoluteTopLeftY,
          appearance // Get the visualization (boolean[][]) from Appearance
        );

        // Assign the sprite to the grid
        this.addSprite(sprite, row, col);
      }
    }
  }

  // Method to determine sprite type based on room position (e.g., corner, wall, floor)
  getSpriteTypeAtPosition(row: u16, col: u16): SpriteTypeIndex {
    // Check for corners
    if (
      (row === 0 && col === 0) || // Top-left corner
      (row === 0 && col === this.maxSpriteCountAcross - 1) || // Top-right corner
      (row === this.maxSpriteCountDown - 1 && col === 0) || // Bottom-left corner
      (row === this.maxSpriteCountDown - 1 &&
        col === this.maxSpriteCountAcross - 1) // Bottom-right corner
    ) {
      return SpriteTypeIndex.Corner; // Place a corner sprite
    }

    // Check for horizontal walls (top or bottom)
    if (row === 0 || row === this.maxSpriteCountDown - 1) {
      return SpriteTypeIndex.HorizontalWall; // Place a horizontal wall sprite
    }

    // Check for vertical walls (left or right)
    if (col === 0 || col === this.maxSpriteCountAcross - 1) {
      return SpriteTypeIndex.VerticalWall; // Place a vertical wall sprite
    }

    // If not a corner or wall, it's an interior floor tile
    return SpriteTypeIndex.Floor;
  }

  // Add a door to the room by placing a door sprite at the specified location
  addDoor(row: u16, col: u16, characteristics: Array<Property>): bool {
    // Check if the position is a valid wall (horizontal or vertical, but not a corner)
    const spriteType = this.getSpriteTypeAtPosition(row, col);

    // Doors can only be placed on walls (not corners or floors)
    if (
      spriteType === SpriteTypeIndex.HorizontalWall ||
      spriteType === SpriteTypeIndex.VerticalWall
    ) {
      const absoluteTopLeftX = this.topLeftX + col * <u16>DEFAULT_BLOCK_SIZE;
      const absoluteTopLeftY = this.topLeftY + row * <u16>DEFAULT_BLOCK_SIZE;

      const doorSprite = new Door(
        absoluteTopLeftX,
        absoluteTopLeftY,
        this.appearance[SpriteTypeIndex.Door], // appearance pulled from the appearace array.
        this.topLeftX,
        this.topLeftY,
        this.doorCharacteristics
      );

      // Add the door sprite to the grid
      return this.addSprite(doorSprite, row, col);
    } else {
      console.log(
        "Invalid position for a door. Doors must be placed on perimeter walls."
      );
      return false;
    }
  }

  // Place pillars and traps
  placePillarsAndTraps(): void {
    const roomWidth = this.getWidthInBlocks();
    const roomHeight = this.getHeightInBlocks();
    const totalFloorArea = roomWidth * roomHeight;

    const numberOfPillars = Math.max(1, Math.floor(totalFloorArea / 16));
    const numberOfTraps = Math.max(1, Math.floor(totalFloorArea / 16));

    this.placeRandomSprites(SpriteTypeIndex.Pillar, numberOfPillars);
    this.placeRandomSprites(SpriteTypeIndex.Trap, numberOfTraps);
  }

  // Place random items
  placeRandomItems(): void {
    const numberOfItems = 3; // Example: 3 random items
    this.placeRandomSprites(SpriteTypeIndex.Item, numberOfItems);
  }

  // Generalized method to place non-player controlled characters (Adversaries and Neutrals)
  placeRandomCharacters(characterType: CharacterTypeIndex, count: u16): void {
    let placed = 0;
    const width = this.getWidthInBlocks();
    const height = this.getHeightInBlocks();

    while (placed < count) {
      const randomX = Math.floor(Math.random() * width);
      const randomY = Math.floor(Math.random() * height);

      if (this.isValidFloorTile(randomX, randomY)) {
        const npcSprite = new Character(
          characterType,
          SpriteTypeIndex.Character,
          this.topLeftX + randomX * <u16>DEFAULT_BLOCK_SIZE,
          this.topLeftY + randomY * <u16>DEFAULT_BLOCK_SIZE,
          this.appearance[SpriteTypeIndex.Character],
          this.getRandomCharacteristics(), // Random characteristics
          this.getRandomBehaviours() // Random behaviours
        );

        this.addSprite(npcSprite, randomY, randomX);
        npcSprite.persistAllProperties(); // Persist the properties to pixels
        placed++;
      }
    }
  }

  // Method to place the player-controlled character (Self)
  placePlayerControlledCharacter(): void {
    let placed = false;
    const width = this.getWidthInBlocks();
    const height = this.getHeightInBlocks();

    while (!placed) {
      const randomX = Math.floor(Math.random() * width);
      const randomY = Math.floor(Math.random() * height);

      if (this.isValidFloorTile(randomX, randomY)) {
        const playerSprite = new Character(
          CharacterTypeIndex.Self, // Player-controlled character
          SpriteTypeIndex.Character,
          this.topLeftX + randomX * <u16>DEFAULT_BLOCK_SIZE,
          this.topLeftY + randomY * <u16>DEFAULT_BLOCK_SIZE,
          this.appearance[SpriteTypeIndex.Character],
          this.getPlayerCharacteristics(), // Characteristics for player character
          this.getPlayerBehaviours() // Behaviours for player character
        );

        this.addSprite(playerSprite, randomY, randomX);
        playerSprite.persistAllProperties(); // Persist the player’s properties to pixels
        placed = true;
      }
    }
  }

  // Utility method to randomly place a given number of sprites of a specific type
  placeRandomSprites(spriteType: SpriteTypeIndex, count: u16): void {
    let placed = 0;
    const width = this.getWidthInBlocks();
    const height = this.getHeightInBlocks();

    while (placed < count) {
      const randomX = Math.floor(Math.random() * width);
      const randomY = Math.floor(Math.random() * height);

      if (this.isValidFloorTile(randomX, randomY)) {
        const sprite = new Sprite(
          spriteType,
          this.topLeftX + randomX * <u16>DEFAULT_BLOCK_SIZE,
          this.topLeftY + randomY * <u16>DEFAULT_BLOCK_SIZE,
          this.appearance[spriteType]
        );
        this.addSprite(sprite, randomY, randomX);
        placed++;
      }
    }
  }

  // Check if a position is a valid floor tile (not a wall or corner)
  isValidFloorTile(col: u16, row: u16): bool {
    const spriteType = this.iSprites[col][row].spriteType;
    return spriteType === SpriteTypeIndex.Floor;
  }

  // Mock method to generate random characteristics for NPCs
  getRandomCharacteristics(): Array<Property> {
    // Example: Generate random characteristics for NPCs
    return [
      new Property(1, 10, 10, PropertyTypeIndex.Characteristic), // Example characteristic
    ];
  }

  // Mock method to generate random behaviours for NPCs
  getRandomBehaviours(): Array<Property> {
    // Example: Generate random behaviours for NPCs
    return [
      new Property(200, 1, 1, PropertyTypeIndex.Behaviour), // Example behaviour
    ];
  }

  // Mock method to generate characteristics for the player-controlled character
  getPlayerCharacteristics(): Array<Property> {
    // Example: Generate characteristics for the player
    return [
      new Property(1, 15, 15, PropertyTypeIndex.Characteristic), // Example characteristic
    ];
  }

  // Mock method to generate behaviours for the player-controlled character
  getPlayerBehaviours(): Array<Property> {
    // Example: Generate behaviours for the player
    return [
      new Property(200, 2, 2, PropertyTypeIndex.Behaviour), // Example behaviour
    ];
  }
}
