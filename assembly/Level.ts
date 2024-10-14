import { Room } from "./Room";
import { Quadrilateral } from "./Quadrilateral";
import {
  DEFAULT_BLOCK_SIZE,
  MAX_ROOMS_PER_LEVEL,
  ROOM_PERIMETER_SPRITES,
  MAX_ROOM_SIZE_PERCENTAGE,
} from "./Constants";
import { Property } from "./Property";
import { Character } from "./Character";
import { AppearanceDefinition } from "./Appearance";

export class Level extends Quadrilateral<u16> {
  rooms: Room[];
  maxRoomArea: u32;
  levelWidth: u16;
  levelHeight: u16;

  constructor(levelWidth: u16, levelHeight: u16) {
    super(0, 0, levelWidth, levelHeight);
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.rooms = new Array<Room>();
    this.maxRoomArea = (super.getAreaInPixels() * 80) / 100; // 80% of total level area
  }

  /**
   * Builds the level by adding rooms with appropriate visualizations.
   * @param visualizations - A mapping of sprite type indexes to their visual templates (Visualization).
   */
  buildLevel(visualizations: AppearanceDefinition[]): void {
    let totalArea: u32 = 0;
    let roomsAdded: u8 = 0;

    while (roomsAdded < MAX_ROOMS_PER_LEVEL && totalArea < this.maxRoomArea) {
      // Calculate the maximum room width and height as a percentage of the level dimensions
      const maxRoomWidth = this.calculateMaxRoomDimension(this.levelWidth);
      const maxRoomHeight = this.calculateMaxRoomDimension(this.levelHeight);

      // Generate room dimensions, ensuring they are divisible by DEFAULT_BLOCK_SIZE
      const roomWidth = this.generateRoomDimension(maxRoomWidth);
      const roomHeight = this.generateRoomDimension(maxRoomHeight);

      // Generate random positions within the level bounds
      const roomX = this.generateRandomPosition(this.levelWidth, roomWidth);
      const roomY = this.generateRandomPosition(this.levelHeight, roomHeight);

      // Create and configure the room, passing the visualizations
      const room = new Room(
        roomX,
        roomY,
        roomX + roomWidth,
        roomY + roomHeight,
        visualizations,
        new Array<Property>(), // wall characteristics
        new Array<Property>(), // floor characteristics
        new Array<Property>() // door characteristics
      );
      const roomArea = roomWidth * roomHeight;

      // Add the room if it doesn't exceed the area limit and is within max rooms
      if (this.addRoom(room)) {
        totalArea += roomArea;
        roomsAdded++;
        console.log(
          `Room added at (${roomX}, ${roomY}) with width ${roomWidth} and height ${roomHeight}.`
        );
      } else {
        console.log(
          `Failed to add room at (${roomX}, ${roomY}) with width ${roomWidth} and height ${roomHeight}.`
        );
      }
    }
  }

  /**
   * Adds a room to the level after verifying the constraints.
   * @param room - The room to be added.
   * @returns true if the room is successfully added, false otherwise.
   */
  addRoom(room: Room): bool {
    if (this.rooms.length >= MAX_ROOMS_PER_LEVEL) {
      console.log(
        `Cannot add more rooms. Maximum of ${MAX_ROOMS_PER_LEVEL} rooms per level reached.`
      );
      return false;
    }

    if (!room.isValidDimensionInPixels()) {
      console.log("Room size is invalid.");
      return false;
    }

    for (let i = 0; i < this.rooms.length; i++) {
      const existingRoom = this.rooms[i];
      if (
        room.intersects(existingRoom) ||
        !this.placeRoomFarApart(room, existingRoom)
      ) {
        console.log("New room overlaps with an existing room or is too close.");
        return false;
      }
    }

    if (!this.isWithinAreaLimit(room)) {
      console.log("Adding this room would exceed the area limit.");
      return false;
    }

    this.rooms.push(room);
    this.ensureHallwayConnection(room);
    return true;
  }

  /**
   * Calculates the maximum room dimension (width or height) as a percentage of the level dimension.
   * @param levelDimension - The width or height of the level.
   * @returns The maximum room dimension.
   */
  private calculateMaxRoomDimension(levelDimension: u16): u16 {
    return (
      Math.floor(
        (levelDimension * MAX_ROOM_SIZE_PERCENTAGE) / DEFAULT_BLOCK_SIZE
      ) * DEFAULT_BLOCK_SIZE
    );
  }

  /**
   * Generates a random room dimension, divisible by DEFAULT_BLOCK_SIZE.
   * @param maxDimension - The maximum allowed dimension for the room.
   * @returns A valid room dimension.
   */
  private generateRoomDimension(maxDimension: u16): u16 {
    return (Math.floor((Math.random() * maxDimension) / DEFAULT_BLOCK_SIZE) *
      DEFAULT_BLOCK_SIZE +
      DEFAULT_BLOCK_SIZE) as u16;
  }

  /**
   * Generates a random position within the level bounds for room placement.
   * @param levelDimension - The width or height of the level.
   * @param roomDimension - The width or height of the room.
   * @returns A valid position for room placement.
   */
  private generateRandomPosition(levelDimension: u16, roomDimension: u16): u16 {
    return (Math.floor(
      Math.random() * ((levelDimension - roomDimension) / DEFAULT_BLOCK_SIZE)
    ) * DEFAULT_BLOCK_SIZE) as u16;
  }

  /**
   * Calculates the total area of all rooms in pixels.
   * @returns The total area in pixels.
   */
  calculateTotalRoomAreaInPixels(): u32 {
    let totalArea: u32 = 0;
    for (let i: i32 = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      totalArea += room.getWidthInPixels() * room.getHeightInPixels();
    }
    return totalArea;
  }

  /**
   * Checks if adding a room keeps the total area within the limit.
   * @param room - The room to be added.
   * @returns True if within area limit, false otherwise.
   */
  isWithinAreaLimit(room: Room): bool {
    return (
      this.calculateTotalRoomAreaInPixels() + room.getAreaInPixels() <=
      this.maxRoomArea
    );
  }

  /**
   * Ensures the new room is placed far enough from existing rooms.
   * @param newRoom - The new room to be placed.
   * @param existingRoom - An existing room to compare against.
   * @returns True if the room is sufficiently far apart, false otherwise.
   */
  placeRoomFarApart(newRoom: Room, existingRoom: Room): bool {
    const bufferInPixels = ROOM_PERIMETER_SPRITES * DEFAULT_BLOCK_SIZE;

    const isTooCloseHorizontally =
      Math.abs(newRoom.topLeftX - existingRoom.bottomRightX) < bufferInPixels ||
      Math.abs(newRoom.bottomRightX - existingRoom.topLeftX) < bufferInPixels;

    const isTooCloseVertically =
      Math.abs(newRoom.topLeftY - existingRoom.bottomRightY) < bufferInPixels ||
      Math.abs(newRoom.bottomRightY - existingRoom.topLeftY) < bufferInPixels;

    return !(isTooCloseHorizontally || isTooCloseVertically);
  }

  /**
   * Ensures at least one hallway connection to the new room.
   * @param room - The room to connect.
   * @returns True if connection is successful.
   */
  ensureHallwayConnection(room: Room): bool {
    // Placeholder logic to ensure at least one hallway connection
    return true;
  }

  /**
   * Connects two rooms with a hallway.
   * @param room1 - The first room.
   * @param room2 - The second room.
   */
  connectRooms(room1: Room, room2: Room): void {
    // Placeholder logic to connect two rooms
  }

  /**
   * Gets the count of rooms in the level.
   * @returns The number of rooms.
   */
  getRoomCount(): u16 {
    return this.rooms.length as u16;
  }

  /**
   * Gets the unique ID of the level.
   * @returns The level ID.
   */
  getID(): string {
    return `Level-${super.getID()}`;
  }

  placeCharacter(character: Character): void {
    // logic for placing a character.
  }
}
