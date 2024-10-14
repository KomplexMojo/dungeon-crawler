import { Door } from "./Door";
import { HallwayTile } from "./HallwayTile";
import { DEFAULT_BLOCK_SIZE } from "./Constants";
import { Property } from "./Property";
import { AppearanceDefinition, PixelPoint } from "./Appearance";

/// <reference types="assemblyscript" />
export class Hallway {
  startDoor: Door;
  endDoor: Door;
  hallwayTiles: Array<HallwayTile>;
  characteristics: Array<Property>;

  constructor(
    startDoor: Door,
    endDoor: Door,
    appearance: AppearanceDefinition,
    characteristics: Array<Property>
  ) {
    this.startDoor = startDoor;
    this.endDoor = endDoor;
    this.hallwayTiles = new Array<HallwayTile>();
    this.characteristics = characteristics;

    // Build the hallway path
    this.buildHallway(appearance);
  }

  /**
   * Builds the hallway by creating hallway tiles between the start and end doors.
   * @param appearance - The appearance for the hallway tiles.
   */
  private buildHallway(appearance: AppearanceDefinition): void {
    // Determine the path from start to end door
    const path = this.calculatePath(
      new PixelPoint(
        this.startDoor.topLeftX + DEFAULT_BLOCK_SIZE,
        this.startDoor.topLeftY
      ),
      new PixelPoint(
        this.endDoor.topLeftX - DEFAULT_BLOCK_SIZE,
        this.endDoor.topLeftY
      )
    );

    // Create hallway tiles along the path
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const hallwayTile = new HallwayTile(
        point.x,
        point.y,
        appearance, // Use the appearance for hallway tiles
        this.characteristics // Apply the characteristics to the hallway tile
      );

      // Persist the characteristics to pixels (if necessary)
      hallwayTile.persistCharacteristics();

      this.hallwayTiles.push(hallwayTile);
    }
  }

  /**
   * Calculates a path between two points.
   * @param topLeftX1 - Starting x-coordinate.
   * @param topLeftY1 - Starting y-coordinate.
   * @param topLeftX2 - Ending x-coordinate.
   * @param topLeftY2 - Ending y-coordinate.
   * @returns An array of points representing the path.
   */
  private calculatePath(
    sourcePixelPoint: PixelPoint,
    destinationPixelPoint: PixelPoint
  ): Array<PixelPoint> {
    const path = new Array<PixelPoint>();

    let currentX = sourcePixelPoint.x;
    let currentY = sourcePixelPoint.y;

    // Determine movement direction
    const deltaX =
      destinationPixelPoint.x > sourcePixelPoint.x
        ? DEFAULT_BLOCK_SIZE
        : -DEFAULT_BLOCK_SIZE;
    const deltaY =
      destinationPixelPoint.y > sourcePixelPoint.y
        ? DEFAULT_BLOCK_SIZE
        : -DEFAULT_BLOCK_SIZE;

    // Move horizontally towards x2
    while (currentX !== destinationPixelPoint.x) {
      path.push(new PixelPoint(currentX, currentY));
      currentX = (currentX + deltaX) as u16;
    }
    /// <reference types="assemblyscript" />
    // Move vertically towards y2
    while (currentY !== destinationPixelPoint.y) {
      path.push(new PixelPoint(currentX, currentY));
      currentY = (currentY + deltaY) as u16;
    }

    // Ensure the end point is included
    path.push(new PixelPoint(destinationPixelPoint.x, destinationPixelPoint.y));

    return path;
  }
}
