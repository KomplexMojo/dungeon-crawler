import { DEFAULT_BLOCK_SIZE } from "./Constants";

export class Quadrilateral<NumberType> {
   topLeftX: NumberType;
   topLeftY: NumberType;
   bottomRightX: NumberType;
   bottomRightY: NumberType;

  constructor(
    topLeftX: NumberType,
    topLeftY: NumberType,
    bottomRightX: NumberType,
    bottomRightY: NumberType
  ) {
    this.topLeftX = topLeftX;
    this.topLeftY = topLeftY;
    this.bottomRightX = bottomRightX;
    this.bottomRightY = bottomRightY;
  }

  getWidthInPixels(): u16 {
    return (this.bottomRightX as u16) - (this.topLeftX as u16);
  }

  getHeightInPixels(): u16 {
    return (this.bottomRightY as u16) - (this.topLeftY as u16);
  }

  getAreaInPixels(): u32 {
    return (this.getWidthInPixels() as u32) * (this.getHeightInPixels() as u32);
  }

  // a level which is 1600 pixels would be 100 blocks.
  getWidthInBlocks(): u8 {
    return (this.getWidthInPixels() / (DEFAULT_BLOCK_SIZE as u16)) as u8;
  }

  // a level which is 1600 pixels would be 100 blocks.
  getHeightInBlocks(): u8 {
    return (this.getHeightInPixels() / (DEFAULT_BLOCK_SIZE as u16)) as u8;
  }

  getAreaInBlocks(): u16 {
    return <u16>(this.getWidthInBlocks() * this.getHeightInBlocks());
  }

  setCoordinates(newX: NumberType, newY: NumberType): void {
    this.topLeftX = newX;
    this.topLeftY = newY;
  }

  getID(): string {
    return `(x = ${this.topLeftX}, y = ${
      this.topLeftY
    }, width = ${this.getWidthInPixels()}, height = ${this.getHeightInPixels()}, area = ${this.getAreaInPixels()})`;
  }

  // Method to check if the quadrilateral meets the minimum size requirements in pixels
  meetsMinimumSizeInPixels(): bool {
    const minSizeInPixels: u8 = DEFAULT_BLOCK_SIZE * 4; // Minimum size to be 4 blocks (4 * 16 pixels)
    if (
      <u8>this.getWidthInPixels() < minSizeInPixels ||
      <u8>this.getHeightInPixels() < minSizeInPixels
    ) {
      return false;
    }
    return true;
  }

  intersects(other: Quadrilateral<NumberType>): bool {
    return !(
      (other.bottomRightX as u16) <= (this.topLeftX as u16) ||
      (other.topLeftX as u16) >= (this.bottomRightX as u16) ||
      (other.bottomRightY as u16) <= (this.topLeftY as u16) ||
      (other.topLeftY as u16) >= (this.bottomRightY as u16)
    );
  }

  contains(x: NumberType, y: NumberType): bool {
    return (
      (x as u16) >= (this.topLeftX as u16) &&
      (x as u16) <= (this.bottomRightX as u16) &&
      (y as u16) >= (this.topLeftY as u16) &&
      (y as u16) <= (this.bottomRightY as u16)
    );
  }
}