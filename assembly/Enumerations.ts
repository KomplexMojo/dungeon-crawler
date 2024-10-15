


export enum GrowthTypeIndex {
  Fixed = 0 as u8,
  Variable = 1 as u8
}

// Array to map enum values to their single-character representation (if applicable)
export const GrowthTypeCharacter = new Array<string>(2);
GrowthTypeCharacter[GrowthTypeIndex.Fixed] = "F";
GrowthTypeCharacter[GrowthTypeIndex.Variable] = "V";

// Array to map enum values to their string names
export const GrowthTypeString = new Array<string>(2);
GrowthTypeString[GrowthTypeIndex.Fixed] = "fixed";
GrowthTypeString[GrowthTypeIndex.Variable] = "variable";

export enum PropertyTypeIndex {
  Characteristic = 0 as u8,
  Behaviour = 1 as u8,
  Appearance = 2 as u8
}

// Array to map enum values to their single-character representation (if applicable)
export const PropertyTypeCharacter = new Array<string>(2);
PropertyTypeCharacter[PropertyTypeIndex.Characteristic] = "C";
PropertyTypeCharacter[PropertyTypeIndex.Behaviour] = "B";
PropertyTypeCharacter[PropertyTypeIndex.Appearance] = "A";


// Array to map enum values to their string names
export const PropertyTypeName = new Array<string>(2);
PropertyTypeName[PropertyTypeIndex.Characteristic] = "Characteristic";
PropertyTypeName[PropertyTypeIndex.Behaviour] = "Behaviour";
PropertyTypeName[PropertyTypeIndex.Appearance] = "Appearance";

export enum PixelTypeIndex {
  Void = 0 as u8,
  Data = 1 as u8,
  Visual = 2 as u8,
}

// Array to map enum values to their single-character representation (if applicable)
export const PixelTypeCharacter = new Array<string>(3);
PixelTypeCharacter[PixelTypeIndex.Void] = " ";
PixelTypeCharacter[PixelTypeIndex.Data] = "D";
PixelTypeCharacter[PixelTypeIndex.Visual] = "V";

// Array to map enum values to their string names
export const PixelTypeName = new Array<string>(3);
PixelTypeName[PixelTypeIndex.Void] = "Void";
PixelTypeName[PixelTypeIndex.Data] = "Data";
PixelTypeName[PixelTypeIndex.Visual] = "Visual";

// Example usage:
// PixelTypeNames[PixelTypeIndexes.Visual] => "Visual"
// PixelTypeCharacters[PixelTypeIndexes.Data] => "D"

export enum SpriteTypeIndex {
  Self = 0,
  Void = 1,
  HorizontalWall = 2,
  VerticalWall = 3,
  Floor = 4,
  Item = 5,
  Character = 6,
  Corner = 7,
  Door = 8,
  Pillar = 9,
  Trap = 10,
  HallwayTile = 11,
}

// Array to map enum values to their single-character representation
export const SpriteTypeCharacter = new Array<string>(11);
SpriteTypeCharacter[SpriteTypeIndex.Self] = "S";
SpriteTypeCharacter[SpriteTypeIndex.Void] = " ";
SpriteTypeCharacter[SpriteTypeIndex.HorizontalWall] = "-";
SpriteTypeCharacter[SpriteTypeIndex.VerticalWall] = "|";
SpriteTypeCharacter[SpriteTypeIndex.Floor] = ".";
SpriteTypeCharacter[SpriteTypeIndex.Item] = "I";
SpriteTypeCharacter[SpriteTypeIndex.Character] = "C";
SpriteTypeCharacter[SpriteTypeIndex.Corner] = "+";
SpriteTypeCharacter[SpriteTypeIndex.Door] = "*";
SpriteTypeCharacter[SpriteTypeIndex.Pillar] = "P";
SpriteTypeCharacter[SpriteTypeIndex.Trap] = "T";
SpriteTypeCharacter[SpriteTypeIndex.HallwayTile] = "H";


// Array to map enum values to their string names
export const SpriteTypeName = new Array<string>(8);
SpriteTypeName[SpriteTypeIndex.Self] = "Self";
SpriteTypeName[SpriteTypeIndex.Void] = "Void";
SpriteTypeName[SpriteTypeIndex.HorizontalWall] = "HorizontalWall";
SpriteTypeName[SpriteTypeIndex.VerticalWall] = "VerticalWall";
SpriteTypeName[SpriteTypeIndex.Floor] = "Floor";
SpriteTypeName[SpriteTypeIndex.Item] = "Item";
SpriteTypeName[SpriteTypeIndex.Character] = "Character";
SpriteTypeName[SpriteTypeIndex.Corner] = "Corner";
SpriteTypeName[SpriteTypeIndex.Door] = "Door";
SpriteTypeCharacter[SpriteTypeIndex.Pillar] = "Pillar";
SpriteTypeCharacter[SpriteTypeIndex.Trap] = "Trap";
SpriteTypeCharacter[SpriteTypeIndex.HallwayTile] = "Trap";


// Example usage:
// SpriteTypeNames[SpriteTypeIndexes.Character] => "Character"
// SpriteTypeCharacters[SpriteTypeIndexes.Character] => "C"

export enum CharacterTypeIndex {
  Self = 0 as u8,
  Ally = 1 as u8,
  Neutral = 2 as u8,
  Adversary = 3 as u8,
}

// Array to map enum values to their single-character representation
export const CharacterTypeCharacter = new Array<string>(4);
CharacterTypeCharacter[CharacterTypeIndex.Self] = "S";
CharacterTypeCharacter[CharacterTypeIndex.Ally] = "A";
CharacterTypeCharacter[CharacterTypeIndex.Neutral] = "N";
CharacterTypeCharacter[CharacterTypeIndex.Adversary] = "E"; // D for "Adversary", to avoid confusion with Ally

// Array to map enum values to their string names
export const CharacterTypeName = new Array<string>(4);
CharacterTypeName[CharacterTypeIndex.Self] = "Self";
CharacterTypeName[CharacterTypeIndex.Ally] = "Ally";
CharacterTypeName[CharacterTypeIndex.Neutral] = "Neutral";
CharacterTypeName[CharacterTypeIndex.Adversary] = "Adversary";

// Example usage:
// CharacterTypeNames[CharacterTypeIndexes.Self] => "Self"
// CharacterTypeCharacters[CharacterTypeIndexes.Adversary] => "D"

enum EventType {
  // Movement Events
  Movement,
  Sprinting,
  Dodging,
  Jumping,
  Climbing,
  Falling,

  // Combat Events
  Attack,
  Defend,
  Parry,
  Block,
  TakeDamage,
  DealDamage,
  CriticalHit,
  MissedAttack,
  CounterAttack,
  Flee,

  // Item Interaction Events
  PickUpItem,
  DropItem,
  UseItem,
  EquipItem,
  UnequipItem,
  DestroyItem,
  RepairItem,
  ExamineItem,

  // Environmental Interaction Events
  OpenDoor,
  CloseDoor,
  BreakDoor,
  LockDoor,
  UnlockDoor,
  PullLever,
  PushButton,
  TriggerTrap,
  DisarmTrap,
  LightTorch,
  ExtinguishTorch,
  EnterRoom,
  ExitRoom,
  DiscoverHiddenPath,

  // Character Interaction Events
  TalkToNPC,
  StartConversation,
  EndConversation,
  OfferTrade,
  AcceptTrade,
  DeclineTrade,
  GiveItem,
  ReceiveItem,
  StealItem,
  HealCharacter,
  ReviveCharacter,
  CastSpell,

  // Status Change Events
  GainHealth,
  LoseHealth,
  GainMana,
  LoseMana,
  Poisoned,
  Cursed,
  BuffApplied,
  DebuffApplied,
  Stunned,
  KnockedOut,
  Died,
  Resurrected,
  Rest,

  // World Events
  Earthquake,
  Flood,
  Fire,
  Thunderstorm,
  Blizzard,
  DarknessFalls,
  LightReturns,
  MagicSurge,
  AreaCleansed,
  AreaCursed,
  TimePasses,
  DayBreaks,
  NightFalls,

  // Puzzle Solving Events
  SolvePuzzle,
  FailPuzzle,
  FindClue,
  PlaceObject,
  RetrieveObject,
  ActivateMechanism,
  DeactivateMechanism,

  // Crafting/Building Events
  GatherResources,
  StartCrafting,
  CompleteCrafting,
  FailCrafting,
  BuildStructure,
  UpgradeStructure,
  DismantleStructure,

  // Stealth Events
  EnterStealth,
  ExitStealth,
  Hide,
  Reveal,
  SneakAttack,
  EvadeDetection,
  SoundAlarm,

  // Travel/Exploration Events
  EnterDungeon,
  ExitDungeon,
  AscendLevel,
  DescendLevel,
  UseTeleport,
  DiscoverNewArea,
  ExamineMap,

  // Resource Management Events
  GainExperience,
  LoseExperience,
  GainGold,
  LoseGold,
  GainResource,
  LoseResource,

  // Quest Progression Events
  StartQuest,
  CompleteQuest,
  FailQuest,
  UpdateQuestObjective,
  ReceiveReward,
  LoseReputation,
  GainReputation,

  // Social Interaction Events
  Compliment,
  Insult,
  Persuade,
  Intimidate,
  Befriend,
  FormAlliance,
  BreakAlliance,
  BetrayCharacter,
  RequestHelp,
  GrantHelp,
  RefuseHelp,

  // Mental State Changes
  BecomeAfraid,
  BecomeAngry,
  BecomeHappy,
  BecomeConfused,
  BecomeFocused,
  BecomeTired,
  BecomeEnergetic,
  Meditate,
  Panic,

  // Special Ability Events
  ActivateSpecialAbility,
  DeactivateSpecialAbility,
  GainSpecialAbility,
  LoseSpecialAbility,
  ChargeAbility,
  AbilityCooldownComplete,

  // Environmental Effect Events
  EnterWater,
  ExitWater,
  GetWet,
  DryOff,
  Freeze,
  Burn,
  PoisonGas,
  LightningStrike,
  HighWinds,
  FogRollsIn,
  FogClears
}

export const EventTypeToString = new Array<string>(4);
  // Movement Events
  EventTypeToString[EventType.Movement]= "Movement";
  EventTypeToString[EventType.Movement]= "Sprinting";
  EventTypeToString[EventType.Dodging]= "Dodging";
  EventTypeToString[EventType.Jumping]= "Jumping";
  EventTypeToString[EventType.Climbing]= "Climbing",
  EventTypeToString[EventType.Falling]= "Falling",

  // Combat Events
  EventTypeToString[EventType.Attack]= "Attack",
  EventTypeToString[EventType.Defend]= "Defend",
  EventTypeToString[EventType.Parry]= "Parry",
  EventTypeToString[EventType.Block]= "Block",
  EventTypeToString[EventType.TakeDamage]= "TakeDamage",
  EventTypeToString[EventType.DealDamage]= "DealDamage",
  EventTypeToString[EventType.CriticalHit]= "CriticalHit",
  EventTypeToString[EventType.MissedAttack]= "MissedAttack",
  EventTypeToString[EventType.CounterAttack]= "CounterAttack",
  EventTypeToString[EventType.Flee]= "Flee",

  // Item Interaction Events
  EventTypeToString[EventType.PickUpItem]= "PickUpItem",
  EventTypeToString[EventType.DropItem]= "DropItem",
  EventTypeToString[EventType.UseItem]= "UseItem",
  EventTypeToString[EventType.EquipItem]= "EquipItem",
  EventTypeToString[EventType.UnequipItem]= "UnequipItem",
  EventTypeToString[EventType.DestroyItem]= "DestroyItem",
  EventTypeToString[EventType.RepairItem]= "RepairItem",
  EventTypeToString[EventType.ExamineItem]= "ExamineItem",

  // Environmental Interaction Events
  EventTypeToString[EventType.OpenDoor]= "OpenDoor",
  EventTypeToString[EventType.CloseDoor]= "CloseDoor",
  EventTypeToString[EventType.BreakDoor]= "BreakDoor",
  EventTypeToString[EventType.LockDoor]= "LockDoor",
  EventTypeToString[EventType.UnlockDoor]= "UnlockDoor",
  EventTypeToString[EventType.PullLever]= "PullLever",
  EventTypeToString[EventType.PushButton]= "PushButton",
  EventTypeToString[EventType.TriggerTrap]= "TriggerTrap",
  EventTypeToString[EventType.DisarmTrap]= "DisarmTrap",
  EventTypeToString[EventType.LightTorch]= "LightTorch",
  EventTypeToString[EventType.ExtinguishTorch]= "ExtinguishTorch",
  EventTypeToString[EventType.EnterRoom]= "EnterRoom",
  EventTypeToString[EventType.ExitRoom]= "ExitRoom",
  EventTypeToString[EventType.DiscoverHiddenPath]= "DiscoverHiddenPath",

  // Character Interaction Events
  EventTypeToString[EventType.TalkToNPC]= "TalkToNPC",
  EventTypeToString[EventType.StartConversation]= "StartConversation",
  EventTypeToString[EventType.EndConversation]= "EndConversation",
  EventTypeToString[EventType.OfferTrade]= "OfferTrade",
  EventTypeToString[EventType.AcceptTrade]= "AcceptTrade",
  EventTypeToString[EventType.DeclineTrade]= "DeclineTrade",
  EventTypeToString[EventType.GiveItem]= "GiveItem",
  EventTypeToString[EventType.ReceiveItem]= "ReceiveItem",
  EventTypeToString[EventType.StealItem]= "StealItem",
  EventTypeToString[EventType.HealCharacter]= "HealCharacter",
  EventTypeToString[EventType.ReviveCharacter]= "ReviveCharacter",
  EventTypeToString[EventType.CastSpell]= "CastSpell",

  // Status Change Events
  EventTypeToString[EventType.GainHealth]= "GainHealth",
  EventTypeToString[EventType.LoseHealth]= "LoseHealth",
  EventTypeToString[EventType.GainMana]= "GainMana",
  EventTypeToString[EventType.LoseMana]= "LoseMana",
  EventTypeToString[EventType.Poisoned]= "Poisoned",
  EventTypeToString[EventType.Cursed]= "Cursed",
  EventTypeToString[EventType.BuffApplied]= "BuffApplied",
  EventTypeToString[EventType.DebuffApplied]= "DebuffApplied",
  EventTypeToString[EventType.Stunned]= "Stunned",
  EventTypeToString[EventType.KnockedOut]= "KnockedOut",
  EventTypeToString[EventType.Died]= "Died",
  EventTypeToString[EventType.Resurrected]= "Resurrected",
  EventTypeToString[EventType.Rest]= "Rest",

  // World Events
  EventTypeToString[EventType.Earthquake]= "Earthquake",
  EventTypeToString[EventType.Flood]= "Flood",
  EventTypeToString[EventType.Fire]= "Fire",
  EventTypeToString[EventType.Thunderstorm]= "Thunderstorm",
  EventTypeToString[EventType.Blizzard]= "Blizzard",
  EventTypeToString[EventType.DarknessFalls]= "DarknessFalls",
  EventTypeToString[EventType.LightReturns]= "LightReturns",
  EventTypeToString[EventType.MagicSurge]= "MagicSurge",
  EventTypeToString[EventType.AreaCleansed]= "AreaCleansed",
  EventTypeToString[EventType.AreaCursed]= "AreaCursed",
  EventTypeToString[EventType.TimePasses]= "TimePasses",
  EventTypeToString[EventType.DayBreaks]= "DayBreaks",
  EventTypeToString[EventType.NightFalls]= "NightFalls",

  // Puzzle Solving Events
  EventTypeToString[EventType.SolvePuzzle]= "SolvePuzzle",
  EventTypeToString[EventType.FailPuzzle]= "FailPuzzle",
  EventTypeToString[EventType.FindClue]= "FindClue",
  EventTypeToString[EventType.PlaceObject]= "PlaceObject",
  EventTypeToString[EventType.RetrieveObject]= "RetrieveObject",
  EventTypeToString[EventType.ActivateMechanism]= "ActivateMechanism",
  EventTypeToString[EventType.DeactivateMechanism]= "DeactivateMechanism",

  // Crafting/Building Events
  EventTypeToString[EventType.GatherResources]= "GatherResources",
  EventTypeToString[EventType.StartCrafting]= "StartCrafting",
  EventTypeToString[EventType.CompleteCrafting]= "CompleteCrafting",
  EventTypeToString[EventType.FailCrafting]= "FailCrafting",
  EventTypeToString[EventType.BuildStructure]= "BuildStructure",
  EventTypeToString[EventType.UpgradeStructure]= "UpgradeStructure",
  EventTypeToString[EventType.DismantleStructure]= "DismantleStructure",

  // Stealth Events
  EventTypeToString[EventType.EnterStealth]= "EnterStealth",
  EventTypeToString[EventType.ExitStealth]= "ExitStealth",
  EventTypeToString[EventType.Hide]= "Hide",
  EventTypeToString[EventType.Reveal]= "Reveal",
  EventTypeToString[EventType.SneakAttack]= "SneakAttack",
  EventTypeToString[EventType.EvadeDetection]= "EvadeDetection",
  EventTypeToString[EventType.SoundAlarm]= "SoundAlarm",

  // Travel/Exploration Events
  EventTypeToString[EventType.EnterDungeon]= "EnterDungeon",
  EventTypeToString[EventType.ExitDungeon]= "ExitDungeon",
  EventTypeToString[EventType.AscendLevel]= "AscendLevel",
  EventTypeToString[EventType.DescendLevel]= "DescendLevel",
  EventTypeToString[EventType.UseTeleport]= "UseTeleport",
  EventTypeToString[EventType.DiscoverNewArea]= "DiscoverNewArea",
  EventTypeToString[EventType.ExamineMap]= "ExamineMap",

  // Resource Management Events
  EventTypeToString[EventType.GainExperience]= "GainExperience",
  EventTypeToString[EventType.LoseExperience]= "LoseExperience",
  EventTypeToString[EventType.GainGold]= "GainGold",
  EventTypeToString[EventType.LoseGold]= "LoseGold",
  EventTypeToString[EventType.GainResource]= "GainResource",
  EventTypeToString[EventType.LoseResource]= "LoseResource",

  // Quest Progression Events
  EventTypeToString[EventType.StartQuest]= "StartQuest",
  EventTypeToString[EventType.CompleteQuest]= "CompleteQuest",
  EventTypeToString[EventType.FailQuest]= "FailQuest",
  EventTypeToString[EventType.UpdateQuestObjective]= "UpdateQuestObjective",
  EventTypeToString[EventType.ReceiveReward]= "ReceiveReward",
  EventTypeToString[EventType.LoseReputation]= "LoseReputation",
  EventTypeToString[EventType.GainReputation]= "GainReputation",

  // Social Interaction Events
  EventTypeToString[EventType.Compliment]= "Compliment",
  EventTypeToString[EventType.Insult]= "Insult",
  EventTypeToString[EventType.Persuade]= "Persuade",
  EventTypeToString[EventType.Intimidate]= "Intimidate",
  EventTypeToString[EventType.Befriend]= "Befriend",
  EventTypeToString[EventType.FormAlliance]= "FormAlliance",
  EventTypeToString[EventType.BreakAlliance]= "BreakAlliance",
  EventTypeToString[EventType.BetrayCharacter]= "BetrayCharacter",
  EventTypeToString[EventType.RequestHelp]= "RequestHelp",
  EventTypeToString[EventType.GrantHelp]= "GrantHelp",
  EventTypeToString[EventType.RefuseHelp]= "RefuseHelp",

  // Mental State Changes
  EventTypeToString[EventType.BecomeAfraid]= "BecomeAfraid",
  EventTypeToString[EventType.BecomeAngry]= "BecomeAngry",
  EventTypeToString[EventType.BecomeHappy]= "BecomeHappy",
  EventTypeToString[EventType.BecomeConfused]= "BecomeConfused",
  EventTypeToString[EventType.BecomeFocused]= "BecomeFocused",
  EventTypeToString[EventType.BecomeTired]= "BecomeTired",
  EventTypeToString[EventType.BecomeEnergetic]= "BecomeEnergetic",
  EventTypeToString[EventType.Meditate]= "Meditate",
  EventTypeToString[EventType.Panic]= "Panic",

  // Special Ability Events
  EventTypeToString[EventType.ActivateSpecialAbility]= "ActivateSpecialAbility",
  EventTypeToString[EventType.DeactivateSpecialAbility]= "DeactivateSpecialAbility",
  EventTypeToString[EventType.GainSpecialAbility]= "GainSpecialAbility",
  EventTypeToString[EventType.LoseSpecialAbility]= "LoseSpecialAbility",
  EventTypeToString[EventType.ChargeAbility]= "ChargeAbility",
  EventTypeToString[EventType.AbilityCooldownComplete]= "AbilityCooldownComplete",

  // Environmental Effect Events
  EventTypeToString[EventType.EnterWater]= "EnterWater",
  EventTypeToString[EventType.ExitWater]= "ExitWater",
  EventTypeToString[EventType.GetWet]= "GetWet",
  EventTypeToString[EventType.DryOff]= "DryOff",
  EventTypeToString[EventType.Freeze]= "Freeze",
  EventTypeToString[EventType.Burn]= "Burn",
  EventTypeToString[EventType.PoisonGas]= "PoisonGas",
  EventTypeToString[EventType.LightningStrike]= "LightningStrike",
  EventTypeToString[EventType.HighWinds]= "HighWinds",
  EventTypeToString[EventType.FogRollsIn]= "FogRollsIn",
  EventTypeToString[EventType.FogClears]= "FogClears"
;