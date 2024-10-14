// Define the index range for characteristics and behaviors
 export const  CHARACTERISTICS_PROPERTY_MIN_INDEX: u8 = 0; 
 export const  CHARACTERISTICS_PROPERTY_MAX_INDEX: u8 = 199;
 export const  BEHAVIOR_PROPERTY_MIN_INDEX: u8 = 200;
 export const  BEHAVIOR_PROPERTY_MAX_INDEX: u8 = 254;
 export const  APPEARANCE_PROPERTY_INDEX: u8 = 255;

 export const  MAX_COLOR_VALUE: u8 = 0xff;
 export const  MIN_COLOR_VALUE: u8 = 0x00;
 export const  DATA_PIXEL_ALPHA_VALUE: u8 = 0x00; // Represents a TRANSPARENT pixel (data)
 export const  VISUAL_PIXEL_ALPHA_VALUE: u8 = 0xff; // Represents a fully visible visual pixel (max alpha)
 export const  DEFAULT_BLOCK_SIZE = 16; // 16 pixel. blocks are square.

 export const  MIN_ROOM_AREA_IN_SPRITES: u8 = 16; // Minimum 4 sprites across
 export const  MAX_ROOMS_PER_LEVEL: u8 = 12;
 export const  ROOM_PERIMETER_SPRITES: u8 = 4; // the number of sprites one room can be from another room.
 export const  MAX_ROOM_SIZE_PERCENTAGE: f32 = 0.25; // max % width and height of a room compared to a level

 export const  MAX_STORED_CHARACTERISTICS: u8 = 60; // the maximum number of data pixels that can be used to store characteristic properties.
 export const  MAX_STORED_BEHAVIOURS: u8 = 30;    // the maximum number of data pixels that can be used to store behavioural properties
 