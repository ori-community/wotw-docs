---
title: Seed Language Documentation
---

Welcome :orihi:

## File Format

Ori 2 Rando seeds are written as .wotws files. You can use them to write [snippets](https://wiki.orirando.com/seedgen/headers) that modify random seed generation, or to write a [plandomizer](https://wiki.orirando.com/plando), allowing you to place all the pickups manually to craft your own seed.

The randomizer ships with a set of [official snippets](https://github.com/SiriusAshling/wotw-seedgen/tree/new_seed_format/assets/snippets). This is how for instance goal modes and hints are implemented. You can use them as a baseline if you want to write similar snippets.

## UberStates

Ori 2 stores its world data in _UberStates_. It's important to understand them because they are referenced throughout the language.

Every UberState has a unique identifier consisting of two numbers. `21786|49485` is the UberState that tracks whether you collected the spirit light orb right of spawn.

Every UberState has a name, although it might not be unique. The name of `21786|49485` is `swampStateGroup.smallExpA`. However another UberState - `21786|52026` - has this name as well, so it's impossible to address this specific UberState by its name.

To help with that we use aliases. The alias for `21786|49485` is `MarshSpawn.FirstPickupEX`. By convention, aliases start with capital letters so you can tell them apart from real UberState names.

All pickup locations have aliases which you can find in [loc_data.csv](https://github.com/ori-community/wotw-seedgen/blob/main/wotw_seedgen/loc_data.csv). Some selected non-pickup world states also have aliases in [state_data.csv](https://github.com/ori-community/wotw-seedgen/blob/main/wotw_seedgen/state_data.csv).

## Triggers

#### Syntax

`on <trigger> <action>`

#### Example

```seed
// When collecting the item right of spawn, the player will get 50 Spirit Light.
on MarshSpawn.FirstEX spirit_light(50)
```

There are three different types of triggers:

- [Client Events](#client-events)
- [UberState Bindings](#uberstate-bindings)
- [Conditions](#conditions)

### Client Events

#### Syntax

`on <client_event> <action>`

#### Example

```seed
// This is what the Spawn With Sword snippet does.
on spawn skill(Skill::Sword)
```

Client Events are special triggers for specific tasks. These are all of them:

- `spawn` - Trigger when starting a new file,
- `reload` - Trigger when starting a new file or loading the seed into an active file,
- `respawn` - Trigger when respawning after death, void etc.,
- `binding_1` - Trigger on keybind,
- `binding_2` - Trigger on keybind,
- `binding_3` - Trigger on keybind,
- `binding_4` - Trigger on keybind,
- `binding_5` - Trigger on keybind,
- `teleport` - Trigger on Teleport,
- `progress_message` - Trigger on the Show Progress keybind,
- `tick` - Trigger every frame,
- `inkwater_trial_text_request` - Trigger when the Inkwater trial reward text should be updated,
- `hollow_trial_text_request` - Trigger when the Hollow trial reward text should be updated,
- `wellspring_trial_text_request` - Trigger when the Wellspring trial reward text should be updated,
- `woods_trial_text_request` - Trigger when the Woods trial reward text should be updated,
- `reach_trial_text_request` - Trigger when the Reach trial reward text should be updated,
- `depths_trial_text_request` - Trigger when the Depths trial reward text should be updated,
- `luma_trial_text_request` - Trigger when the Luma trial reward text should be updated,
- `wastes_trial_text_request` - Trigger when the Wastes trial reward text should be updated,

### UberState Bindings

#### Syntax

`on change <uber_state> <action>`

#### Example

```seed
// Whenever the player gains or loses gorlek ore they will see a message with their current amount.
on change player.gorlekOre item_message("I love ore and now I have " + player.gorlekOre)
```

### Conditions

#### Syntax

`on <condition> <action>`

#### Example

```seed
// When collecting the item right of spawn, the player will get a gorlek ore.
on MarshSpawn.FirstEX gorlek_ore()
```

```seed
// Once the player surpasses 4000 spirit light, they will see a message.
on player.spiritLight > 4000 item_message("You're rich!")
```

Conditions trigger when their value changes from `false` to `true`.

For example, `on player.spiritLight > 4000` will trigger once when the spirit light changes to above 4000, but it won't trigger on any future changes to the amount of spirit light. `on MarshSpawn.FirstEX || MarshSpawn.RockHC` will trigger when the player collects the first of these two pickups, but not again when they collect the other. `on MarshSpawn.FirstEX && MarshSpawn.RockHC` will only trigger once the player collected both pickups.

## Actions

Actions are instructions for the randomizer, such as giving items, showing messages or changing UberStates.

There are three different types of actions:

- [Multis](#multis)
- [Conditionals](#conditionals)
- [Function Calls](#function_calls)

### Multis

#### Syntax

`{ <action>... }`

#### Example

```seed
on MarshSpawn.RockHC {
    spirit_light(1)
    item_message("That's why you go team right...")
}
```

### Conditionals

#### Syntax

`if <condition> <action>`

#### Example

```seed
// This will show a message everytime the player gains or loses spirit light and has more than 4000 afterwards.
// The braces are just for easier reading.
on change player.spiritLight {
 if player.spiritLight > 4000 item_message("Spend your money already or I'll annoy you forever!")
}
```

### Function calls

#### Syntax

`<function_name>(<args>...)`

#### Example

```seed
// This function is called "item_messsage_with_timeout" and has two arguments:
// The message and the timeout until it disappears in seconds.
on MarshSpawn.RockHC item_messsage_with_timeout("The emptyness haunts you...", 60)
```

See [Function Definitions](#function-definitions) and [Functions](#functions) for more details.

## Function Definitions

#### Syntax

`fun <function_name>() { <action>... }`

#### Example

```seed
// This defines a custom function called "exciting_gorlek_ore" which displays a message and gives a gorlek ore
fun exciting_gorlek_ore() {
    item_message("It's finally here! Fresh out of the mines!")
    gorlek_ore()
}
// Now you can reuse the function to avoid repetition
on MarshSpawn.FirstPickupEX exciting_gorlek_ore()
on MarshSpawn.RockHC exciting_gorlek_ore()
```

## Reference

### Functions

#### fetch

```seed
fetch(uber_identifier: UberIdentifier) -> Boolean
fetch(uber_identifier: UberIdentifier) -> Integer
fetch(uber_identifier: UberIdentifier) -> Float
```

#### is_in_hitbox

```seed
is_in_hitbox(x1: Float, y1: Float, x2: Float, y2: Float) -> Boolean
```

#### get_boolean

```seed
get_boolean(id: String) -> Boolean
```

#### get_integer

```seed
get_integer(id: String) -> Integer
```

#### to_integer

```seed
to_integer(float: Float) -> Integer
```

#### get_float

```seed
get_float(id: String) -> Float
```

#### to_float

```seed
to_float(integer: Integer) -> Float
```

#### get_string

```seed
get_string(id: String) -> String
```

#### to_string

```seed
to_string(boolean: Boolean) -> String
to_string(integer: Integer) -> String
to_string(float: Float) -> String
to_string(string: String) -> String
```

#### spirit_light_string

```seed
spirit_light_string(amount: Integer) -> String
```

#### remove_spirit_light_string

```seed
remove_spirit_light_string(amount: Integer) -> String
```

#### gorlek_ore_string

```seed
gorlek_ore_string() -> String
```

#### remove_gorlek_ore_string

```seed
remove_gorlek_ore_string() -> String
```

#### keystone_string

```seed
keystone_string() -> String
```

#### remove_keystone_string

```seed
remove_keystone_string() -> String
```

#### shard_slot_string

```seed
shard_slot_string() -> String
```

#### remove_shard_slot_string

```seed
remove_shard_slot_string() -> String
```

#### health_fragment_string

```seed
health_fragment_string() -> String
```

#### remove_health_fragment_string

```seed
remove_health_fragment_string() -> String
```

#### energy_fragment_string

```seed
energy_fragment_string() -> String
```

#### remove_energy_fragment_string

```seed
remove_energy_fragment_string() -> String
```

#### skill_string

```seed
skill_string(skill: Skill) -> String
```

#### remove_skill_string

```seed
remove_skill_string(skill: Skill) -> String
```

#### shard_string

```seed
shard_string(shard: Shard) -> String
```

#### remove_shard_string

```seed
remove_shard_string(shard: Shard) -> String
```

#### teleporter_string

```seed
teleporter_string(teleporter: Teleporter) -> String
```

#### remove_teleporter_string

```seed
remove_teleporter_string(teleporter: Teleporter) -> String
```

#### clean_water_string

```seed
clean_water_string() -> String
```

#### remove_clean_water_string

```seed
remove_clean_water_string() -> String
```

#### weapon_upgrade_string

```seed
weapon_upgrade_string(weapon_upgrade: WeaponUpgrade) -> String
```

#### remove_weapon_upgrade_string

```seed
remove_weapon_upgrade_string(weapon_upgrade: WeaponUpgrade) -> String
```

#### current_zone

```seed
current_zone() -> Zone
```

#### spirit_light

```seed
spirit_light(amount: Integer)
```

#### remove_spirit_light

```seed
remove_spirit_light(amount: Integer)
```

#### gorlek_ore

```seed
gorlek_ore()
```

#### remove_gorlek_ore

```seed
remove_gorlek_ore()
```

#### keystone

```seed
keystone()
```

#### remove_keystone

```seed
remove_keystone()
```

#### shard_slot

```seed
shard_slot()
```

#### remove_shard_slot

```seed
remove_shard_slot()
```

#### health_fragment

```seed
health_fragment()
```

#### remove_health_fragment

```seed
remove_health_fragment()
```

#### energy_fragment

```seed
energy_fragment()
```

#### remove_energy_fragment

```seed
remove_energy_fragment()
```

#### skill

```seed
skill(skill: Skill)
```

#### remove_skill

```seed
remove_skill(skill: Skill)
```

#### shard

```seed
shard(shard: Shard)
```

#### remove_shard

```seed
remove_shard(shard: Shard)
```

#### teleporter

```seed
teleporter(teleporter: Teleporter)
```

#### remove_teleporter

```seed
remove_teleporter(teleporter: Teleporter)
```

#### clean_water

```seed
clean_water()
```

#### remove_clean_water

```seed
remove_clean_water()
```

#### weapon_upgrade

```seed
weapon_upgrade(weapon_upgrade: WeaponUpgrade)
```

#### remove_weapon_upgrade

```seed
remove_weapon_upgrade(weapon_upgrade: WeaponUpgrade)
```

#### item_message

```seed
item_message(message: String)
```

#### item_message_with_timeout

```seed
item_message_with_timeout(message: String, timeout: Float)
```

#### priority_message

```seed
priority_message(message: String, timeout: Float)
```

#### controlled_priority_message

```seed
controlled_priority_message(id: String, message: String, timeout: Float)
```

#### free_message

```seed
free_message(id: String, message: String)
```

#### destroy_message

```seed
destroy_message(id: String)
```

#### set_message_text

```seed
set_message_text(id: String, message: String)
```

#### set_message_timeout

```seed
set_message_timeout(id: String, timeout: Float)
```

#### set_message_background

```seed
set_message_background(id: String, background: Boolean)
```

#### set_message_position

```seed
set_message_position(id: String, x: Float, y: Float)
```

#### set_message_alignment

```seed
set_message_alignment(id: String, alignment: Alignment)
```

#### set_message_screen_position

```seed
set_message_screen_position(id: String, screen_position: ScreenPosition)
```

#### store

```seed
store(uber_identifier: UberIdentifier, value: Boolean)
store(uber_identifier: UberIdentifier, value: Integer)
store(uber_identifier: UberIdentifier, value: Float)
```

#### store_without_triggers

```seed
store_without_triggers(uber_identifier: UberIdentifier, value: Boolean)
store_without_triggers(uber_identifier: UberIdentifier, value: Integer)
store_without_triggers(uber_identifier: UberIdentifier, value: Float)
```

#### set_boolean

```seed
set_boolean(id: String, value: Boolean)
```

#### set_integer

```seed
set_integer(id: String, value: Integer)
```

#### set_float

```seed
set_float(id: String, value: Float)
```

#### set_string

```seed
set_string(id: String, value: String)
```

#### save

```seed
save()
```

#### checkpoint

```seed
checkpoint()
```

#### warp

```seed
warp(x: Float, y: Float)
```

#### equip

```seed
equip(slot: EquipSlot, equipment: Equipment)
```

#### unequip

```seed
unequip(equipment: Equipment)
```

#### trigger_keybind

```seed
trigger_keybind(bind: String)
```

#### enable_server_sync

```seed
enable_server_sync(uber_identifier: UberIdentifier)
```

#### disable_server_sync

```seed
disable_server_sync(uber_identifier: UberIdentifier)
```

#### create_warp_icon

```seed
create_warp_icon(id: String, x: Float, y: Float)
```

#### set_warp_icon_label

```seed
set_warp_icon_label(id: String, label: String)
```

#### destroy_warp_icon

```seed
destroy_warp_icon(id: String)
```

#### set_shop_item_data

```seed
set_shop_item_data(uber_identifier: UberIdentifier, price: Integer, name: String, description: String, icon: Icon)
```

#### set_shop_item_price

```seed
set_shop_item_price(uber_identifier: UberIdentifier, price: Integer)
```

#### set_shop_item_name

```seed
set_shop_item_name(uber_identifier: UberIdentifier, name: String)
```

#### set_shop_item_description

```seed
set_shop_item_description(uber_identifier: UberIdentifier, description: String)
```

#### set_shop_item_icon

```seed
set_shop_item_icon(uber_identifier: UberIdentifier, icon: Icon)
```

#### set_shop_item_hidden

```seed
set_shop_item_hidden(uber_identifier: UberIdentifier, hidden: Boolean)
```

#### set_shop_item_locked

```seed
set_shop_item_locked(uber_identifier: UberIdentifier, locked: Boolean)
```

#### set_wheel_item_data

```seed
set_wheel_item_data(wheel: String, position: WheelItemPosition, name: String, description: String, icon: Icon, action: Action)
```

#### set_wheel_item_name

```seed
set_wheel_item_name(wheel: String, position: WheelItemPosition, name: String)
```

#### set_wheel_item_description

```seed
set_wheel_item_description(wheel: String, position: WheelItemPosition, description: String)
```

#### set_wheel_item_icon

```seed
set_wheel_item_icon(wheel: String, position: WheelItemPosition, icon: Icon)
```

#### set_wheel_item_color

```seed
set_wheel_item_color(wheel: String, position: WheelItemPosition, red: Integer, green: Integer, blue: Integer, alpha: Integer)
```

#### set_wheel_item_action

```seed
set_wheel_item_action(wheel: String, position: WheelItemPosition, bind: WheelBind, action: Action)
```

#### destroy_wheel_item

```seed
destroy_wheel_item(wheel: String, position: WheelItemPosition)
```

#### switch_wheel

```seed
switch_wheel(wheel: String)
```

#### set_wheel_pinned

```seed
set_wheel_pinned(wheel: String, pinned: Boolean)
```

#### clear_all_wheels

```seed
clear_all_wheels()
```

### Skills

```seed
Skill::Bash
Skill::WallJump
Skill::DoubleJump
Skill::Launch
Skill::Glide
Skill::SpiritFlame
Skill::WaterBreath
Skill::Grenade
Skill::Grapple
Skill::Flash
Skill::Spear
Skill::Regenerate
Skill::Bow
Skill::Hammer
Skill::Sword
Skill::Burrow
Skill::Dash
Skill::WaterDash
Skill::Shuriken
Skill::Seir
Skill::BowCharge
Skill::Magnet
Skill::Blaze
Skill::Sentry
Skill::Flap
Skill::WeaponCharge
Skill::GladesAncestralLight
Skill::InkwaterAncestralLight
```

### Shards

```seed
Shard::Overcharge
Shard::TripleJump
Shard::Wingclip
Shard::Bounty
Shard::Swap
Shard::Magnet
Shard::Splinter
Shard::Reckless
Shard::Quickshot
Shard::Resilience
Shard::SpiritLightHarvest
Shard::Vitality
Shard::LifeHarvest
Shard::EnergyHarvest
Shard::Energy
Shard::LifePact
Shard::LastStand
Shard::Sense
Shard::UltraBash
Shard::UltraGrapple
Shard::Overflow
Shard::Thorn
Shard::Catalyst
Shard::Turmoil
Shard::Sticky
Shard::Finesse
Shard::SpiritSurge
Shard::Lifeforce
Shard::Deflector
Shard::Fracture
Shard::Arcing
```

### Teleporters

```seed
Teleporter::Inkwater
Teleporter::Den
Teleporter::Hollow
Teleporter::Glades
Teleporter::Wellspring
Teleporter::Burrows
Teleporter::WoodsEntrance
Teleporter::WoodsExit
Teleporter::Reach
Teleporter::Depths
Teleporter::CentralLuma
Teleporter::LumaBoss
Teleporter::FeedingGrounds
Teleporter::CentralWastes
Teleporter::OuterRuins
Teleporter::InnerRuins
Teleporter::Willow
Teleporter::Shriek
```

### Weapon Upgrades

```seed
WeaponUpgrade::ExplodingSpear
WeaponUpgrade::HammerShockwave
WeaponUpgrade::StaticShuriken
WeaponUpgrade::ChargeBlaze
WeaponUpgrade::RapidSentry
```

### Zones

```seed
Zone::Inkwater
Zone::Hollow
Zone::Glades
Zone::Wellspring
Zone::Woods
Zone::Reach
Zone::Depths
Zone::Luma
Zone::Wastes
Zone::Ruins
Zone::Willow
Zone::Burrows
Zone::Spawn
Zone::Shop
Zone::Void
```

### Alignments

```seed
Alignment::Left
Alignment::Center
Alignment::Right
Alignment::Justify
```

### Screen Positions

```seed
ScreenPosition::TopLeft
ScreenPosition::TopCenter
ScreenPosition::TopRight
ScreenPosition::MiddleLeft
ScreenPosition::MiddleCenter
ScreenPosition::MiddleRight
ScreenPosition::BottomLeft
ScreenPosition::BottomCenter
ScreenPosition::BottomRight
```

### Equip Slots

```seed
EquipSlot::Ability1
EquipSlot::Ability2
EquipSlot::Ability3
```

### Equipment

```seed
Equipment::Hammer
Equipment::Bow
Equipment::Sword
Equipment::Torch
Equipment::Swordstaff
Equipment::Chainsword
Equipment::Shot
Equipment::HomingMissiles
Equipment::Wave
Equipment::Whirl
Equipment::Glow
Equipment::LockOn
Equipment::Shield
Equipment::Invisibility
Equipment::LifeAbsorb
Equipment::Shards
Equipment::Grenade
Equipment::Sentry
Equipment::Spear
Equipment::Regenerate
Equipment::Teleport
Equipment::Shuriken
Equipment::Blaze
Equipment::Turret
Equipment::Sein
Equipment::Launch
Equipment::Bash
Equipment::Grapple
Equipment::Burrow
Equipment::Drill
Equipment::DoubleJump
Equipment::Flap
Equipment::Dash
Equipment::Bounce
Equipment::Glide
Equipment::ChargeJump
Equipment::WaterDash
Equipment::Climb
Equipment::WeaponCharge
Equipment::DamageUpgradeA
Equipment::DamageUpgradeB
Equipment::WaterBreath
```

### Wheel Item Positions

```seed
WheelItemPosition::Top
WheelItemPosition::TopRight
WheelItemPosition::RightTop
WheelItemPosition::Right
WheelItemPosition::RightBottom
WheelItemPosition::BottomRight
WheelItemPosition::Bottom
WheelItemPosition::BottomLeft
WheelItemPosition::LeftBottom
WheelItemPosition::Left
WheelItemPosition::LeftTop
WheelItemPosition::TopLeft
```

### Wheel Binds

```seed
WheelBind::All
WheelBind::Ability1
WheelBind::Ability2
WheelBind::Ability3
```
