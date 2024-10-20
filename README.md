# dungeon-crawler
 Dungeon Crawler game incorporating elements of AI and the blockchain.

# Data Pixel Encoding Scheme
# Category                  Index Range     Total   Purpose
- **Characteristics:**      000-024         25      Capturing characteristics attached to the sprite, a single sprite can only capture 50% of the possible characteristic indexes
- **Behaviours:**           025-049         25      Capturing behaviours related to the sprite, a single sprite can only capture 50% of the possible behaviour indexes
- **Events Encountered:**   050-100         50      Capturing the events that are related to this sprite.

## Encoding Rules 100 data pixels in total for encoded data
### Sprite Characteristics and Behaviours (first 40 free data pixel slots)
- **R Channel:** Characteristic/Behaviour Index
- **G Channel:** Property Index or Current Value
- **B Channel:** Max Value (for continuous characteristics, set to Property Index for discrete characteristics)

### Sprite Item Inventory (next 40 free data pixel slots, items, spells)
- **R Channel:** Characteristic Index
- **G Channel:** Current Value
- **B Channel:** Max Value

### Category	           Index Range	Total Purpose
- **Visual Appearance	    000-039:**	40	  Defines the visual aspects of sprites, such as their graphical representation.
- **Sprite Characteristics	040-089:**	50	  Captures various static attributes of sprites, like type, stats, affinities, etc.
- **Sprite Behaviors	    090-139:**	50	  Defines dynamic behaviors or states that sprites can exhibit, such as being cursed, enchanted, etc.
- **Game Events Structure	140-189:**	50	  Structures the events that occur within the game, potentially defining triggers, conditions, and effects.
- **Event Trigger Types	    190-209:**	20	  Specifies the types of triggers that can initiate game events, such as player actions, environmental changes, etc.
- **Event Effect Types	    210-229:**	20	  Defines the outcomes or consequences of game events, like dealing damage, healing, spawning items, etc.
- **Event Condition Types	230-255:**	26	  Sets the prerequisites or conditions that must be met for an event to occur, such as character stats, item possession, location, etc.

### JSON File Structure