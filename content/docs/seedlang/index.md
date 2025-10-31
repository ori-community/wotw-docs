---
title: Seed Language Documentation
---

Welcome :orihi:

## File Format

The Seed Language is used for [snippets](https://wiki.orirando.com/seedgen/headers) and [plandomizers](https://wiki.orirando.com/plando). Both are written in .wotws files.

Snippets only define a part of a seed. Any amount of them can be used during seed generation and locations not assigned anything by snippets will be randomly filled.

Plandomizers define the entire seed. They have to be compiled by the seed generator, but it won't add any random placements.

The randomizer ships with a set of [official snippets](https://github.com/ori-community/wotw-seedgen/tree/v5/assets/snippets). This is how for instance goal modes and hints are implemented. You can use them as a baseline if you want to write similar snippets.

### Editor support

Seedgen will include a language server (subcommand `lsp`) that can provide features such as UberState autocomplete. A [VSCode extension](https://github.com/ori-community/wotw-seedlang-vscode) integrating it is available. Any other editor supporting the language server protocol should be able to use it as well.

### Using custom snippets

Initially custom snippets will probably work like custom headers do now: In the launcher you have to paste them into a text field, in local seedgen you can use them with the same level of support as official snippets.

### Compiling plandomizers

A compiler will be integrated into the local seedgen. This is already implemented in the [v5 branch](https://github.com/ori-community/wotw-seedgen/tree/v5), see subcommand `plando`.

## UberStates

Ori 2 stores its world data in _UberStates_. It's important to understand them because they are referenced throughout the language.

Every UberState has a unique identifier consisting of two numbers. `21786|49485` is the UberState that tracks whether you collected the spirit light orb right of spawn.

Every UberState has a name, although it might not be unique. The name of `21786|49485` is `swampStateGroup.smallExpA`. However another UberState (`21786|52026`) has the same name, so it's impossible to address this specific UberState by its name.

To help with that we use aliases. The alias for `21786|49485` is `MarshSpawn.FirstPickupEX`. By convention, aliases start with capital letters so you can tell them apart from real UberState names.

All pickup locations have aliases which you can find in [loc_data.csv](https://github.com/ori-community/wotw-seedgen/blob/main/wotw_seedgen/loc_data.csv). Some selected non-pickup world states also have aliases in [state_data.csv](https://github.com/ori-community/wotw-seedgen/blob/main/wotw_seedgen/state_data.csv).

## Triggers

`on <trigger> <action>`

##### Example

```seed
// When collecting the item right of spawn, the player will get 50 Spirit Light.
on MarshSpawn.FirstEX spirit_light(50)
```

##### Notes

There are three different types of triggers:

- [Client Events](#client-events)
- [UberState Bindings](#uberstate-bindings)
- [Conditions](#conditions)

### Client Events

`on <client_event> <action>`

##### Example

```seed
// This is what the Spawn With Sword snippet does.
on spawn skill(Skill::Sword)
```

##### Notes

Client Events are special triggers for specific tasks. These are all of them:

- `spawn` - Trigger when starting a new file,
- `reload` - Trigger when starting a new file or loading the seed into an active file,
- `respawn` - Trigger when respawning after death, void etc.,
- `binding1` - Trigger on keybind,
- `binding2` - Trigger on keybind,
- `binding3` - Trigger on keybind,
- `binding4` - Trigger on keybind,
- `binding5` - Trigger on keybind,
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

`on change <uber_state> <action>`

##### Example

```seed
// Whenever the player gains or loses gorlek ore they will see a message with their current amount.
on change player.gorlekOre item_message("I love ore and now I have " + player.gorlekOre)
```

### Conditions

`on <condition> <action>`

##### Examples

```seed
// When collecting the item right of spawn, the player will get a gorlek ore.
on MarshSpawn.FirstEX gorlek_ore()
```

```seed
// Once the player surpasses 4000 spirit light, they will see a message.
on player.spiritLight > 4000 item_message("You're rich!")
```

##### Notes

Conditions trigger when their value changes from `false` to `true`.

For example, `on player.spiritLight > 4000` will trigger when the spirit light changes from 4000 to 4100, but it won't trigger again if it then changes from 4100 to 4150. If the player loses spirit light, dropping to 4000 or less and then goes above 4000 a second time, it will trigger again. `on MarshSpawn.FirstEX || MarshSpawn.RockHC` will trigger when the player collects the first of these two pickups, but not again when they collect the other. `on MarshSpawn.FirstEX && MarshSpawn.RockHC` will only trigger once the player collected both pickups.

## Actions

Actions are instructions for the randomizer, such as giving items, showing messages or changing UberStates.

There are three different types of actions:

- [Multis](#multis)
- [Ifs](#ifs)
- [Function Calls](#function-calls)

### Multis

`{ <action>... }`

##### Example

```seed
on MarshSpawn.RockHC {
    spirit_light(1)
    item_message("That's why you go team right...")
}
```

### Ifs

`if <condition> <action>`

##### Example

```seed
// This will show a message everytime the player gains or loses spirit light and has more than 4000 afterwards.
// The braces are just for easier reading.
on change player.spiritLight {
 if player.spiritLight > 4000 item_message("Spend your money already or I'll annoy you forever!")
}
```

### Function calls

`<function_name>(<args>...)`

##### Example

```seed
// This function is called "item_message_with_timeout" and has two arguments:
// The message and the timeout until it disappears in seconds.
on MarshSpawn.RockHC item_message_with_timeout("The emptyness haunts you...", 60)
```

##### Notes

See [Standard Functions](#standard-functions) and [Function Definitions](#function-definitions) for more details.

## Standard Functions

### Common Items

#### spirit_light

```seed
spirit_light(amount: Integer)
```

##### Example

```seed
on binding1 spirit_light(50)
// Equivalent to:
on binding1 {
    store(player.spiritLight, player.spiritLight + 50)
    item_message(spirit_light_string(50))
}
```

#### gorlek_ore

```seed
gorlek_ore()
```

##### Example

```seed
on binding1 gorlek_ore()
// Equivalent to:
on binding1 {
    store(player.gorlekOre, player.gorlekOre + 1)
    item_message(gorlek_ore_string())
}
```

#### keystone

```seed
keystone()
```

##### Example

```seed
on binding1 keystone()
// Equivalent to:
on binding1 {
    store(player.keystones, player.keystones + 1)
    item_message(keystone_string())
}
```

#### shard_slot

```seed
shard_slot()
```

##### Example

```seed
on binding1 shard_slot()
// Equivalent to:
on binding1 {
    store(player.shardSlots, player.shardSlots + 1)
    item_message(shard_slot_string())
}
```

#### health_fragment

```seed
health_fragment()
```

##### Example

```seed
on binding1 health_fragment()
// Equivalent to:
on binding1 {
    store(player.maxHealth, player.maxHealth + 5)
    store(player.health, player.maxHealth)
    item_message(health_fragment_string())
}
```

#### energy_fragment

```seed
energy_fragment()
```

##### Example

```seed
on binding1 energy_fragment()
// Equivalent to:
on binding1 {
    store(player.maxEnergy, player.maxEnergy + 0.5)
    store(player.energy, player.maxEnergy)
    item_message(energy_fragment_string())
}
```

#### skill

```seed
skill(skill: Skill)
```

##### Example

```seed
on binding1 skill(Skill::Shuriken)
// Equivalent to:
on binding1 {
    store(skills.shuriken, true)
    item_message(skill_string(Skill::Shuriken))
}
```

##### Notes

See [Skills](#skills) for possible values.

#### shard

```seed
shard(shard: Shard)
```

##### Example

```seed
on binding1 shard(Shard::Deflector)
// Equivalent to:
on binding1 {
    store(shards.shuriken, true)
    item_message(shard_string(Shard::Deflector))
}
```

##### Notes

See [Shards](#shards) for possible values.

#### teleporter

```seed
teleporter(teleporter: Teleporter)
```

##### Example

```seed
on binding1 teleporter(Teleporter::Shriek)
// Equivalent to:
on binding1 {
    store(WillowsEnd.ShriekTeleporterActive, true)
    item_message(teleporter_string(Teleporter::Shriek))
}
```

##### Notes

See [Teleporters](#teleporters) for possible values.

#### clean_water

```seed
clean_water()
```

##### Example

```seed
on binding1 clean_water()
// Equivalent to:
on binding1 {
    store(randoState.cleanWater, true)
    item_message(clean_water_string())
}
```

#### weapon_upgrade

```seed
weapon_upgrade(weapon_upgrade: WeaponUpgrade)
```

##### Example

```seed
on binding1 weapon_upgrade(WeaponUpgrade::ChargeBlaze)
// Equivalent to:
on binding1 {
    store(weapon_upgrades.chargeBlaze, true)
    item_message(weapon_upgrade_string(WeaponUpgrade::ChargeBlaze))
}
```

##### Notes

See [Weapon Upgrades](#weapon-upgrades) for possible values.

### Remove Items

#### remove_spirit_light

```seed
remove_spirit_light(amount: Integer)
```

##### Example

```seed
on binding1 remove_spirit_light(50)
// Equivalent to:
on binding1 {
    store(player.spiritLight, player.spiritLight - 50)
    item_message(remove_spirit_light_string(50))
}
```

#### remove_gorlek_ore

```seed
remove_gorlek_ore()
```

##### Example

```seed
on binding1 remove_gorlek_ore()
// Equivalent to:
on binding1 {
    store(player.gorlekOre, player.gorlekOre - 1)
    item_message(remove_gorlek_ore_string())
}
```

#### remove_keystone

```seed
remove_keystone()
```

##### Example

```seed
on binding1 remove_keystone()
// Equivalent to:
on binding1 {
    store(player.keystones, player.keystones - 1)
    item_message(remove_keystone_string())
}
```

#### remove_shard_slot

```seed
remove_shard_slot()
```

##### Example

```seed
on binding1 remove_shard_slot()
// Equivalent to:
on binding1 {
    store(player.shardSlots, player.shardSlots - 1)
    item_message(remove_shard_slot_string())
}
```

#### remove_health_fragment

```seed
remove_health_fragment()
```

##### Example

```seed
on binding1 remove_health_fragment()
// Equivalent to:
on binding1 {
    store(player.maxHealth, player.maxHealth - 5)
    item_message(remove_health_fragment_string())
}
```

#### remove_energy_fragment

```seed
remove_energy_fragment()
```

##### Example

```seed
on binding1 remove_energy_fragment()
// Equivalent to:
on binding1 {
    store(player.maxEnergy, player.maxEnergy - 0.5)
    item_message(remove_energy_fragment_string())
}
```

#### remove_skill

```seed
remove_skill(skill: Skill)
```

##### Example

```seed
on binding1 remove_skill(Skill::Shuriken)
// Equivalent to:
on binding1 {
    store(skills.shuriken, false)
    item_message(remove_skill_string(Skill::Shuriken))
}
```

##### Notes

See [Skills](#skills) for possible values.

#### remove_shard

```seed
remove_shard(shard: Shard)
```

##### Example

```seed
on binding1 remove_shard(Shard::Deflector)
// Equivalent to:
on binding1 {
    store(shards.deflector, false)
    item_message(remove_shard_string(Shard::Deflector))
}
```

##### Notes

See [Shards](#shards) for possible values.

#### remove_teleporter

```seed
remove_teleporter(teleporter: Teleporter)
```

##### Example

```seed
on binding1 remove_teleporter(Teleporter::Shriek)
// Equivalent to:
on binding1 {
    store(16155|50867, false) // Teleporter UberStates often have ambiguous names
    item_message(remove_teleporter_string(Teleporter::Shriek))
}
```

##### Notes

See [Teleporters](#teleporters) for possible values.

#### remove_clean_water

```seed
remove_clean_water()
```

##### Example

```seed
on binding1 remove_clean_water()
// Equivalent to:
on binding1 {
    store(randoState.cleanWater, false)
    item_message(remove_clean_water_string())
}
```

#### remove_weapon_upgrade

```seed
remove_weapon_upgrade(weapon_upgrade: WeaponUpgrade)
```

##### Example

```seed
on binding1 remove_weapon_upgrade(WeaponUpgrade::ChargeBlaze)
// Equivalent to:
on binding1 {
    store(weapon_upgrades.chargeBlaze, false)
    item_message(remove_weapon_upgrade_string(WeaponUpgrade::ChargeBlaze))
}
```

##### Notes

See [Weapon Upgrades](#weapon-upgrades) for possible values.

### Messages

There are three different types of messages:

- [Item Messages](#item_message)
- [Priority Messages](#priority_message)
- [Free Messages](#free_message)

Usually item messages are used in reaction to world changes, priority messages are used in reaction to key presses and free messages are used for advanced applications with custom message layouts.

You can use concatenation to include the return values of functions and UberStates into your messages.

##### Example

```seed
on binding1 item_message(player.spiritLight + " Spirit Light owned")
```

![example message with concatenation](/images/messageconcatenation.png)

Additionally, the resulting message will be processed further by the game.

##### Examples

```seed
on binding1 {
    item_message("This\nmessage\nhas\nfive\nlines.")
    // Or, for better readability:
    item_message(
        "This\n" +
        "message\n" +
        "has\n" +
        "five\n" +
        "lines."
    )
}
```

![example message with five lines](/images/messagefivelines.png)

```seed
on binding1 item_message(
    "Here be colors: *blue*, #yellow#, @red@, $green$ and <purple>purple</>.\n" +
    "As a side effect, it's impossible to show any of these symbols in a message: *#@$<>"
)
```

![example message with colors](/images/messagecolors.png)

```seed
on binding1 item_message("Other colors <hex_32cd32ff>are possible</> by using their hexadecimal rgba")
```

![example message with hex colors](/images/messagehexcolors.png)

```seed
on binding1 item_message("<s_3>*BIG HUG*</>")
```

![example message with font size](/images/messagefontsize.png)

```seed
on binding1 item_message("<ls_1.5>Very \n far \n apart</>")
```

![example message with line size](/images/messagelinesize.png)

```seed
// This will insert the player's own keybind for the action.
on binding1 item_message("Press [OpenRandoWheel] to open the rando wheel.")
```

![example message with keybind](/images/messagekeybind.png)

See also: [List of possible values for keybind interpolation](https://github.com/ori-community/wotw-rando-client/blob/main/projects/Core/enums/actions.h)

Some message properties can be changed after the message has been created:

| Creation Function           | Destroy   | Text      | Timeout   | Background | Position  | Alignment | Anchor    |
| --------------------------- | --------- | --------- | --------- | ---------- | --------- | --------- | --------- |
| item_message                | ❌        | ❌        | ❌        | ❌         | ❌        | ❌        | ❌        |
| item_message_with_timeout   | ❌        | ❌        | ❌        | ❌         | ❌        | ❌        | ❌        |
| priority_message            | ❌        | ❌        | ❌        | ❌         | ❌        | ❌        | ❌        |
| controlled_priority_message | :orihype: | :orihype: | :orihype: | :orihype:  | ❌        | ❌        | ❌        |
| free_message                | :orihype: | :orihype: | :orihype: | :orihype:  | :orihype: | :orihype: | :orihype: |

#### item_message

```seed
item_message(message: String)
```

##### Example

```seed
on binding1 item_message("Hi! You seem to have " + player.gorlekOre + " Gorlek Ore.")
```

##### Notes

Item messages will enter a queue in the top center region of the screen. If too many messages are already visible, new ones will wait until they have space to appear. By default item messages disappear after a 4 second timeout; the timeout only runs while they're visible.

#### item_message_with_timeout

```seed
item_message_with_timeout(message: String, timeout: Float)
```

##### Example

```seed
on binding1 item_message_with_timeout("Hi! You seem to have " + player.gorlekOre + " Gorlek Ore.", 2)
```

##### Notes

Same as [item_message](#item_message) with a custom timeout.

#### priority_message

```seed
priority_message(message: String, timeout: Float)
```

##### Example

```seed
on binding1 priority_message("Pressing this bind fills you with determination", 6)
```

##### Notes

Priority messages will appear instantly at the top center of the screen. Only 1 priority message can be visible at once, previous ones will be destroyed. Item messages will move out of the way as necessary to show the priority message.

#### controlled_priority_message

```seed
controlled_priority_message(id: String, message: String, timeout: Float)
```

##### Notes

Same as [priority_message](#priority_message) with an id to change its properties later. Note that the position of a priority message cannot be changed.

#### free_message

```seed
free_message(id: String, message: String)
```

##### Notes

Free messages will not interact with other messages in any way. They can appear on top of other messages and on top of eachother. It's your responsibility to control their position. They won't disappear by themselves, you have to set their timeout or destroy them manually.

#### destroy_message

```seed
destroy_message(id: String)
```

##### Example

```seed
on binding1 free_message(
    "confirmation",
    "Just making sure, you did read this message in its entirety?\n" +
    "[Binding2] Yes"
)
on binding2 destroy_message("confirmation")
```

#### set_message_text

```seed
set_message_text(id: String, message: String)
```

#### set_message_timeout

```seed
set_message_timeout(id: String, timeout: Float)
```

##### Notes

Starts a timeout for the message to disappear.

#### set_message_background

```seed
set_message_background(id: String, background: Boolean)
```

##### Notes

Controls whether the background box behind the text is rendered.

Defaults to `true`.

#### set_message_position

```seed
set_message_position(id: String, x: Float, y: Float)
```

##### Notes

How the position is interpreted depends on the message's [horizontal anchor](#set_message_horizontal_anchor), [vertical anchor](#set_message_vertical_anchor) and [coordinate system](#set_message_coordinate_system)

Defaults to `0.5, 0.114`, which approximates the default position of other messages at the top center of the screen.

#### set_message_alignment

```seed
set_message_alignment(id: String, alignment: Alignment)
```

##### Notes

Controls the text alignment, which will only matter on multiline messages. `Alignment::Justify` exists but we're not sure if it works.

For most cases you may prefer to use [`set_message_screen_position`](#set_message_screen_position)

Defaults to `Alignment::Center`.

See [Alignments](#alignments) for possible values.

#### set_message_horizontal_anchor

```seed
set_message_horizontal_anchor(id: String, horizontal_anchor: HorizontalAnchor)
```

##### Notes

Controls which part of the message box its [x position](#set_message_position) refers to.

For most cases you may prefer to use [`set_message_screen_position`](#set_message_screen_position)

Defaults to `HorizontalAnchor::Center`.

See [Horizontal Anchors](#horizontal-anchors) for possible values.

#### set_message_vertical_anchor

```seed
set_message_vertical_anchor(id: String, vertical_anchor: VerticalAnchor)
```

##### Notes

Controls which part of the message box its [y position](#set_message_position) refers to.

For most cases you may prefer to use [`set_message_screen_position`](#set_message_screen_position)

Defaults to `VerticalAnchor::Top`.

See [Vertical Anchors](#vertical-anchors) for possible values.

#### set_message_screen_position

```seed
set_message_screen_position(id: String, screen_position: ScreenPosition)
```

##### Example

```seed
on binding1 {
    free_message("top_left", "I will appear in the top left corner.")
    set_message_screen_position("top_left", ScreenPosition::TopLeft)
    set_message_position("top_left", 0, 0)
}
// Equivalent to:
on binding1 {
    free_message("top_left", "I will appear in the top left corner.")
    set_message_alignment("top_left", Alignment::Left)
    set_message_horizontal_anchor("top_left", HorizontalAnchor::Left)
    set_message_vertical_anchor("top_left", VerticalAnchor::Top)
    set_message_position("top_left", 0, 0)
}
```

##### Notes

In essence, the first part of the screen position controls the [vertical anchor](#set_message_vertical_anchor) and the second part the [horizontal anchor](#set_message_horizontal_anchor) and [alignment](#set_message_alignment). This only allows for a subset of possible alignment and anchor combinations, but it's useful for the most common cases.

Defaults to `ScreenPosition::TopCenter`.

See [Screen Positions](#screen-positions) for possible values.

#### set_message_box_width

```seed
set_message_box_width(id: String, width: Float)
```

##### Notes

By default, message boxes fit their content. Using this you can instead set a fixed width.

#### set_message_coordinate_system

```seed
set_message_coordinate_system(id: String, coordinate_system: CoordinateSystem)
```

##### Notes

Controls how the message's [position](#set_message_position) is interpreted:

- `CoordinateSystem::Absolute` uses the game's internal positioning, which doesn't account for different resolutions and is not recommended.
- `CoordinateSystem::Relative` normalizes coordinates so that (0, 0) is the top left corner and (1, 1) the bottom right corner of the screen.
- `CoordinateSystem::World` places the message at in-world coordinates, meaning it's not relative to the camera anymore at all.

Defaults to `CoordinateSystem::Relative`.

See [Coordinate Systems](#coordinate-systems) for possible values.

### Common Item Texts

#### spirit_light_string

```seed
spirit_light_string(amount: Integer) -> String
```

##### Notes

Every instance of this function in your code will be assigned a random spirit light name. This way random spirit light names within the same seed always appear at the same places.

#### gorlek_ore_string

```seed
gorlek_ore_string() -> String
```

#### keystone_string

```seed
keystone_string() -> String
```

#### shard_slot_string

```seed
shard_slot_string() -> String
```

#### health_fragment_string

```seed
health_fragment_string() -> String
```

#### energy_fragment_string

```seed
energy_fragment_string() -> String
```

#### skill_string

```seed
skill_string(skill: Skill) -> String
```

##### Notes

See [Skills](#skills) for possible values.

#### shard_string

```seed
shard_string(shard: Shard) -> String
```

##### Notes

See [Shards](#shards) for possible values.

#### teleporter_string

```seed
teleporter_string(teleporter: Teleporter) -> String
```

##### Notes

See [Teleporters](#teleporters) for possible values.

#### clean_water_string

```seed
clean_water_string() -> String
```

#### weapon_upgrade_string

```seed
weapon_upgrade_string(weapon_upgrade: WeaponUpgrade) -> String
```

##### Notes

See [Weapon Upgrades](#weapon-upgrades) for possible values.

### Remove Item Texts

#### remove_spirit_light_string

```seed
remove_spirit_light_string(amount: Integer) -> String
```

#### remove_gorlek_ore_string

```seed
remove_gorlek_ore_string() -> String
```

#### remove_keystone_string

```seed
remove_keystone_string() -> String
```

#### remove_shard_slot_string

```seed
remove_shard_slot_string() -> String
```

#### remove_health_fragment_string

```seed
remove_health_fragment_string() -> String
```

#### remove_energy_fragment_string

```seed
remove_energy_fragment_string() -> String
```

#### remove_skill_string

```seed
remove_skill_string(skill: Skill) -> String
```

##### Notes

See [Skills](#skills) for possible values.

#### remove_shard_string

```seed
remove_shard_string(shard: Shard) -> String
```

##### Notes

See [Shards](#shards) for possible values.

#### remove_teleporter_string

```seed
remove_teleporter_string(teleporter: Teleporter) -> String
```

##### Notes

See [Teleporters](#teleporters) for possible values.

#### remove_clean_water_string

```seed
remove_clean_water_string() -> String
```

#### remove_weapon_upgrade_string

```seed
remove_weapon_upgrade_string(weapon_upgrade: WeaponUpgrade) -> String
```

##### Notes

See [Weapon Upgrades](#weapon-upgrades) for possible values.

### UberState Interactions

#### fetch

```seed
fetch(uber_identifier: UberIdentifier) -> Boolean
fetch(uber_identifier: UberIdentifier) -> Integer
fetch(uber_identifier: UberIdentifier) -> Float
```

##### Example

```seed
on binding1 item_message("Gorlek Ore: " + fetch(player.gorlekOre))
// Or, for convenience:
on binding1 item_message("Gorlek Ore: " + player.gorlekOre)
```

##### Notes

Often you don't have to use `fetch` explicitely since it's inferred when you use an UberState identifier. The type of the return value depends on the type of the UberState.

#### store

```seed
store(uber_identifier: UberIdentifier, value: Boolean)
store(uber_identifier: UberIdentifier, value: Integer)
store(uber_identifier: UberIdentifier, value: Float)
```

##### Example

```seed
on binding1 store(player.health, -1) // Setting health to a negative value kills the player
```

##### Notes

The expected type of the value depends on the type of the UberState.

#### store_without_triggers

```seed
store_without_triggers(uber_identifier: UberIdentifier, value: Boolean)
store_without_triggers(uber_identifier: UberIdentifier, value: Integer)
store_without_triggers(uber_identifier: UberIdentifier, value: Float)
```

##### Example

```seed
on spawn store_without_triggers(MarshSpawn.FirstPickupEX, true) // This will make the pickup disappear but not grant the reward
```

##### Notes

Identical to [store](#store), but prevents any [Triggers](#triggers) from happening as a direct consequence of this UberState change. The expected type of the value depends on the type of the UberState.

### Variables

You can store temporary values in variables. This can be useful for calculations, or to pass values to custom functions. Variables will not be stored in the savefile, so generally you should not assume they keep existing beyond the current frame. If you need persistent values, use [!state](#state)

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

#### get_boolean

```seed
get_boolean(id: String) -> Boolean
```

#### get_integer

```seed
get_integer(id: String) -> Integer
```

#### get_float

```seed
get_float(id: String) -> Float
```

#### get_string

```seed
get_string(id: String) -> String
```

### Shops

#### set_shop_item_data

```seed
set_shop_item_data(uber_identifier: UberIdentifier, price: Integer, name: String, description: String, icon: Icon)
```

##### Notes

Shorthand to use [set_shop_item_price](#set_shop_item_price), [set_shop_item_name](#set_shop_item_name), [set_shop_item_description](#set_shop_item_description) and [set_shop_item_icon](#set_shop_item_icon).

See [Icons](#icons) for possible values.

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

##### Notes

See [Icons](#icons) for possible values.

#### set_shop_item_hidden

```seed
set_shop_item_hidden(uber_identifier: UberIdentifier, hidden: Boolean)
```

#### set_shop_item_locked

```seed
set_shop_item_locked(uber_identifier: UberIdentifier, locked: Boolean)
```

### Wheels

See [Wheel Item Positions](#wheel-item-positions) for possible values.

#### set_wheel_item_data

```seed
set_wheel_item_data(wheel: String, position: WheelItemPosition, name: String, description: String, icon: Icon, action: Action)
```

##### Notes

Shorthand to use [set_wheel_item_name](#set_wheel_item_name), [set_wheel_item_description](#set_wheel_item_description), [set_wheel_item_icon](#set_wheel_item_icon) and [set_wheel_item_action](#set_wheel_item_action) with `WheelBind::All`.

See [Icons](#icons) for possible values.

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

##### Notes

See [Icons](#icons) for possible values.

#### set_wheel_item_color

```seed
set_wheel_item_color(wheel: String, position: WheelItemPosition, red: Integer, green: Integer, blue: Integer, alpha: Integer)
```

#### set_wheel_item_action

```seed
set_wheel_item_action(wheel: String, position: WheelItemPosition, bind: WheelBind, action: Action)
```

##### Notes

See [Wheel Binds](#wheel-binds) for possible values.

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

### Warp Icons

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

### Miscellaneous

#### to_integer

```seed
to_integer(float: Float) -> Integer
```

##### Notes

Often you don't have to use `to_integer` explicitely since it's inferred when you need an integer.

#### to_float

```seed
to_float(integer: Integer) -> Float
```

##### Notes

Often you don't have to use `to_float` explicitely since it's inferred when you need a float.

#### to_string

```seed
to_string(boolean: Boolean) -> String
to_string(integer: Integer) -> String
to_string(float: Float) -> String
to_string(string: String) -> String
```

##### Notes

Often you don't have to use `to_string` explicitely since it's inferred when you need a string.

#### is_in_hitbox

```seed
is_in_hitbox(x1: Float, y1: Float, x2: Float, y2: Float) -> Boolean
```

#### current_zone

```seed
current_zone() -> Zone
```

#### save

```seed
save()
```

#### save_to_memory

```seed
save_to_memory()
```

#### warp

```seed
warp(x: Float, y: Float)
```

#### equip

```seed
equip(slot: EquipSlot, equipment: Equipment)
```

##### Notes

See [Equip Slots](#equip-slots) and [Equipment](#equipment) for possible values.

#### unequip

```seed
unequip(equipment: Equipment)
```

##### Notes

See [Equipment](#equipment) for possible values.

#### trigger_keybind

```seed
trigger_keybind(bind: String)
```

##### Notes

See [Randomizer Actions](https://github.com/ori-community/wotw-rando-client/blob/main/projects/Core/enums/actions.h) for a list of possible values.

#### enable_server_sync

```seed
enable_server_sync(uber_identifier: UberIdentifier)
```

##### Notes

Currently only works to undo [disable_server_sync](#disable_server_sync), you cannot enable syncing for UberStates which aren't synced by default.

#### disable_server_sync

```seed
disable_server_sync(uber_identifier: UberIdentifier)
```

## Function Definitions

`fun <function_name>() { <action>... }`

##### Example

```seed
// This defines a custom function called "exciting_gorlek_ore" which displays a message and gives a gorlek ore.
fun exciting_gorlek_ore() {
    item_message("It's finally here! Fresh out of the mines!")
    gorlek_ore()
}
// Now you can reuse the function to avoid repetition.
on MarshSpawn.FirstPickupEX exciting_gorlek_ore()
on MarshSpawn.RockHC exciting_gorlek_ore()
```

##### Notes

Passing arguments to custom functions is not currently supported. Use [variables](#variables) instead.

## Commands

Where triggers and actions are instructions for the randomizer, commands are instructions for the compiler and seed generator. They provide features such as code splitting, adding settings to your snippet or customizing random placements.

### Including Files

You can include existing snippets, or split your plandomizer across multiple files if you want.

#### include

```seed
!include(<snippet>)
!include(<snippet>, <identifier>, ...)
```

##### Example

```seed
!include("wisps")  // wisps is the snippet adding the wisps goal mode
!include("bonus_item_core", extra_double_jump)

on binding1 extra_double_jump()
```

##### Notes

If you want to include custom snippets they need to be in the snippet or plandomizer folder.

When making a plandomizer, you probably want to include some of the official snippets. You don't need to copy them anywhere, simply add them as includes. Most notably, `seed_core` is included in every generated seed and is responsible for many randomizer critical tasks such as enabling teleport anywhere. Here is a selection of includes to get your plandomizer into a similar starting point as a generated seed with the gorlek preset:

```seed
!include("seed_core")
!include("progress_helper")
!include("no_cutscenes")
!include("shrine_hints")
!include("trial_hints")
!include("better_mechanics")
!include("spawn_tuley")
!include("no_rain")
!include("knowledge_hints")
```

#### export

```seed
!export(<identifier>)
```

##### Example

```seed
fun cool_custom_item() {
    item_message(":oricool:")
}
// This allows other snippets to !include cool_custom_item
!export(cool_custom_item)
```

#### augment_fun

```seed
!augment_fun(<identifier>, <action>)
```

##### Example

```seed
// file: define_event.wotws
!export(keybind_event)
fun keybind_event() {}
// This will show a message and give a gorlek ore if the snippets below are used
on binding1 keybind_event()
```

```seed
// file: message_on_event.wotws
!include("define_event", keybind_event)
!augment_fun(keybind_event, item_message("Hi!"))
```

```seed
// file: ore_on_event.wotws
!include("define_event", keybind_event)
!augment_fun(keybind_event, gorlek_ore())
```

#### bundle_icon

```seed
!bundle_icon(<identifier>, <path>)
```

##### Example

```seed
!bundle_icon(explosions_icon, "icons/explosions.png")
// Now you can use the icon anywhere
on reload set_wheel_item_icon("root", WheelItemPosition::Bottom, explosions_icon)
```

##### Notes

The icon path starts in the snippet or plandomizer folder.

After compilation the icon will be bundled into the seed, with this you can use custom icons in your plandomizer without requiring the players to download the icons separately.

#### builtin_icon

```seed
!builtin_icon(<identifier>, <path>)
```

##### Example

```seed
// This icon ships with the randomizer
!builtin_icon(minimap_icon, "assets/icons/wheel/minimap.png")
// Now you can use the icon anywhere
on reload set_wheel_item_icon("root", WheelItemPosition::Bottom, minimap_icon)
```

##### Notes

The randomizer ships with a set of [preinstalled assets](https://github.com/ori-community/wotw-rando-assets). They will be installed into a folder called assets, which is why you need to prefix `assets/` in front of all the paths.

### Custom UberStates

#### state

```seed
!state(<identifier>, <type>)
```

##### Example

```seed
!state(triforce_fragments, Integer)

fun triforce_fragment() {
    store(triforce_fragments, triforce_fragments + 1)
    if triforce_fragments < 8 {
        item_message("Triforce Fragment (" + triforce_fragments + "/8)")
    }
    if triforce_fragments == 8 {
        item_message("Triforce Fragment $(8/8)$")
        store(gameStateGroup.gameFinished, true)
        item_message("Thanks Link!")
    }
}
```

##### Notes

Only the types `Boolean`, `Integer` and `Float` are allowed here. It's not possible to persistently store strings.

#### timer

```seed
!timer(<toggle>, <timer>)
```

##### Example

```seed
!timer(timer_enabled, timer)

on binding1 {
    store(timer, 0)
    store(timer_enabled, true)
}
on timer > 7.5 {
    store(timer_enabled, false)
    item_message("This message shows with a delay of 7.5 seconds.")
}
```

### Item Pool Changes

Item pool changes are only relevant for snippets used in seed generation, they do nothing for plandos.

#### add

```seed
!add(<action>, <amount>)
```

##### Example

```seed
// Add a second Burrow to the item pool
!add(skill(Skill::Burrow), 1)
```

#### remove

```seed
!remove(<action>, <amount>)
```

##### Example

```seed
// This is what the No Launch snippet does
!remove(skill(Skill::Launch), 1)
```

#### item_data

```seed
!item_data(<action>, <name>, <price>, <description>, <icon>, <map icon>)
```

##### Example

```seed
fun custom_item() {}
!item_data(
    custom_item(),
    "Custom Item",  // Name when being placed in a shop
    1000,  // Base price when being placed in a shop
    "I assure you it's great",  // Description when being placed in a shop
    Equipment::Invisibility,  // Icon when being placed in a shop
    MapIcon::BonusItem  // Map icon for the spoiler filter
)
```

##### Notes

Shorthand to use [item_data_name](#item_data_name), [item_data_price](#item_data_price), [item_data_description](#item_data_description), [item_data_icon](#item_data_icon) and [item_data_map_icon](#item_data_map_icon) (yet to be implemented).

See [Icons](#icons) and [Map Icons](#map-icons) for possible values.

#### item_data_name

```seed
!item_data_name(<action>, <name>)
```

#### item_data_price

```seed
!item_data_price(<action>, <price>)
```

#### item_data_description

```seed
!item_data_description(<action>, <description>)
```

#### item_data_map_icon

```seed
!item_data_map_icon(<action>, <map icon>)
```

##### Notes

See [Map Icons](#map-icons) for possible values.

#### item_data_icon

```seed
!item_data_icon(<action>, <icon>)
```

##### Notes

See [Icons](#icons) for possible values.

### Snippet Settings

#### config

```seed
!config(<identifier>, <description>, <type>, <default>)
```

##### Example

```seed
!config(treasure_size, "How much money is inside the treasure chest", Integer, 1000)

fun treasure_chest() {
    item_message("You found the #treasure chest#!")
    spirit_light(treasure_size)
}

!add(treasure_chest())
```

##### Notes

Snippet settings will be available for configuration in the launcher or seedgen cli when generating random seeds with the snippet, but they can also be controlled by a plandomizer using [set_config](#set_config).

#### set_config

```seed
!set_config(<snippet>, <identifier>, <value>)
```

##### Example

```seed
// Include knowledge hints (for example, in your plando), but turn off the regen hint (since it doesn't fit your plando's style/progression)
!include("knowledge_hints")
!set_config("knowledge_hints", regen_logic_hint, "false")
```

##### Notes

This command is useful in plandomizers, when you want to include snippets out of your control and change their configuration.

You probably shouldn't use it in snippets intended for seed generation, where configuration is supposed to be controller by the player generating the seed.

Note that you have to put the value inside a string. This is because making good compilers is hard.

### Spawn Location

#### spawn

```seed
!spawn(<x>, <y>)
```

##### Example

```seed
// This is a black box in the void. Useful if you want to have some kind of menu before starting the plandomizer.
!spawn(-3537, -5881)
```

##### Notes

Setting the spawn location is only relevant for plandos, it does nothing for snippets used in seed generation.

### Compile-time evaluation

You can use compile-time evaluation to conditionally include parts of your code depending on [Snippet Settings](#snippet-settings) or to improve code readability without hurting performance. Compile-time evaluation happens during seed generation or plandomizer compilation, it will be completely optimized away in the finished seed.

#### let

```seed
!let(<identifier>, <value>)
```

##### Example

```seed
// In case you can't read hexcolors in your brain, giving them names might help
!let(lime_green, "<hex_32cd32ff>")

on binding1 item_message(lime_green + "ooo fancy color")
// In the resulting seed, this gives exactly the same output as:
on binding1 item_message("<hex_32cd32ff>ooo fancy color")
```

#### if

```seed
!if <condition> { ... }
```

##### Example

```seed
!config(do_shenanigans, "Enable at your own risk", Boolean, false)

// In the resulting seed, only one of the two sections below will be included
!if do_shenanigans {
    !add(item_message(skill_string(Skill::Burrow)))
}
!if do_shenanigans == false {
    on spawn item_message("You didn't even enable shenanigans... Boring!")
}
```

#### repeat

```seed
!repeat <amount> { ... }
```

##### Example

```seed
!config(motay_clones, "How many clones of Motay should assist you", Integer, 1)

!repeat motay_clones {
    on spawn item_message("Hey! I'm Motay! I will help you!")
}
```

### Compile-time Randomness

These values will be different every time the snippet is used or the plandomizer is compiled. In the finished seed, the value won't change anymore.

Values that can change randomly while playing the seed still need to be implemented.

#### random_integer

```seed
!random_integer(<identifier>, <min>, <max>)
```

##### Example

```seed
!random_integer(number, 1, 100)
on binding1 item_message(number)
```

#### random_float

```seed
!random_float(<identifier>, <min>, <max>)
```

##### Example

```seed
!random_float(number, 0, 2.5)
on binding1 item_message(number)
```

#### random_pool

```seed
!random_pool(<identifier>, <type>, [ <value>... ])
```

##### Notes

See [!random_from_pool](#random_from_pool) for more details.

#### random_from_pool

```seed
!random_from_pool(<identifier>, <pool identifier>)
```

##### Example

```seed
!random_pool(greetings_pool, String, [
    "Greetings",
    "Welcome",
    "Hello"
])
!random_from_pool(greeting, greetings_pool)
on spawn item_message(greeting)
```

##### Notes

Using `random_from_pool` will remove one random value from the pool created with `random_pool`. If you draw from the same pool again, that value will be gone. If you attempt to draw from a pool which is already empty, compilation will fail.

### Hint Data

These are very specialized commands to support our hint systems.

#### zone_of

```seed
!zone_of(<identifier>, <action>)
```

##### Example

```seed
!zone_of(burrow_zone, skill(Skill::Burrow))
on binding1 item_message("Burrow: " + burrow_zone)
```

##### Notes

See [Zones](#zones) for possible values.

#### item_on

```seed
!item_on(<identifier>, <trigger>)
```

##### Example

```seed
!item_on(marsh_shrine_item, MarshPastOpher.CombatShrine)
on binding1 item_message("Complete the Marsh Combat Shrine to gain\n" + marsh_shrine_item)
```

#### count_in_zone

```seed
!count_in_zone([ (<identifier>, <zone>),... ], [ <action>... ])
```

##### Example

```seed
!count_in_zone(
    [
        (weapons_in_marsh, Zone::Marsh),
        (weapons_in_hollow, Zone::Hollow),
        (weapons_in_glades, Zone::Glades),
    ],
    [
        skill(Skill::Grenade),
        skill(Skill::Spear),
        skill(Skill::Bow),
        skill(Skill::Hammer),
        skill(Skill::Sword),
        skill(Skill::Shuriken),
        skill(Skill::Blaze),
        skill(Skill::Sentry),
    ]
)

on binding1 item_message("Marsh Weapons - " + weapons_in_marsh)
on binding2 item_message("Hollow Weapons - " + weapons_in_hollow)
on binding3 item_message("Glades Weapons - " + weapons_in_glades)
```

##### Notes

See [Zones](#zones) for possible values.

### Miscellaneous

#### tags

```seed
!tags(<tag>,...)
```

##### Example

```seed
// This will be listed as one of the tags when starting a new save file
!tags("Fun included")
```

#### set_logic_state

```seed
!set_logic_state(<name>)
```

##### Notes

This can manually tell logic that a state from [loc_data.csv](https://github.com/ori-community/wotw-seedgen/blob/main/wotw_seedgen/loc_data.csv) or [state_data.csv](https://github.com/ori-community/wotw-seedgen/blob/main/wotw_seedgen/state_data.csv) is reachable from spawn.

This is useful when having to write custom logic for a snippet such as no combat.

#### preplace

```seed
!preplace(<action>, <zone>)
```

##### Example

```seed
// Sword will be placed somewhere in Marsh
!preplace(skill(Skill::Sword), Zone::Marsh)
```

##### Notes

Preplacements happen before any logic, they are placed in a random location of the specified zone which is not already occupied by other preplacements.

See [Zones](#zones) for possible values.

## Annotations

Snippets may add annotations to influence how they are presented to the user. They do nothing in plandomizers.

#### Hidden

```seed
#hidden
```

##### Notes

The snippet will be invisible to the user. It only exists to be [included](#include) by other snippets.

#### Category

```seed
#category(<string>)
```

##### Example

```seed
#category("World Changes")
```

##### Notes

Snippets of the same category will be shown together.

#### Name

```seed
#name(<string>)
```

##### Example

```seed
#name("Better Hornbug")
```

#### Description

```seed
#description(<string>)
```

##### Example

```seed
#description("This will change how you play the randomizer forever")
```

##### Notes

Snippets of the same category will be shown together

## Reference

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
Skill::MarshAncestralLight
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
Teleporter::Marsh
Teleporter::Den
Teleporter::Hollow
Teleporter::Glades
Teleporter::Wellspring
Teleporter::Burrows
Teleporter::WoodsEntrance
Teleporter::WoodsExit
Teleporter::Reach
Teleporter::Depths
Teleporter::CentralPools
Teleporter::PoolsBoss
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
Zone::Marsh
Zone::Hollow
Zone::Glades
Zone::Wellspring
Zone::Woods
Zone::Reach
Zone::Depths
Zone::Pools
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

### Horizontal Anchors

```seed
HorizontalAnchor::Left
HorizontalAnchor::Center
HorizontalAnchor::Right
```

### Vertical Anchors

```seed
VerticalAnchor::Top
VerticalAnchor::Middle
VerticalAnchor::Bottom
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

### Coordinate Systems

```seed
CoordinateSystem::Absolute
CoordinateSystem::Relative
CoordinateSystem::World
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

### Icons

In addition to the icons below, you may use [Shards](#shards) and [Equipments](#equipment) as icons.

See also [!builtin_icon](#builtin_icon) and [!bundle_icon](#bundle_icon) to use images as icons.

```seed
OpherIcon::Sentry
OpherIcon::RapidSentry
OpherIcon::Hammer
OpherIcon::HammerShockwave
OpherIcon::Shuriken
OpherIcon::StaticShuriken
OpherIcon::Spear
OpherIcon::ExplodingSpear
OpherIcon::Blaze
OpherIcon::ChargeBlaze
OpherIcon::WaterBreath
OpherIcon::FastTravel

LupoIcon::EnergyFragmentsMap
LupoIcon::HealthFragmentsMap
LupoIcon::ShardsMap

GromIcon::RepairTheSpiritWell
GromIcon::DwellingRepairs
GromIcon::ThornySituation
GromIcon::RoofsOverHeads
GromIcon::ClearTheCaveEntrance
GromIcon::OnwardsAndUpwards
GromIcon::TheGorlekTouch

TuleyIcon::SelaFlowers
TuleyIcon::StickyGrass
TuleyIcon::Lightcatchers
TuleyIcon::BlueMoon
TuleyIcon::SpringPlants
TuleyIcon::TheLastSeed
```

### Map Icons

```seed
MapIcon::Keystone
MapIcon::Mapstone
MapIcon::BreakableWall
MapIcon::BreakableWallBroken
MapIcon::StompableFloor
MapIcon::StompableFloorBroken
MapIcon::EnergyGateTwo
MapIcon::EnergyGateOpen
MapIcon::KeystoneDoorFour
MapIcon::KeystoneDoorOpen
MapIcon::AbilityPedestal
MapIcon::HealthUpgrade
MapIcon::EnergyUpgrade
MapIcon::SavePedestal
MapIcon::AbilityPoint
MapIcon::KeystoneDoorTwo
MapIcon::Invisible
MapIcon::Experience
MapIcon::MapstonePickup
MapIcon::EnergyGateTwelve
MapIcon::EnergyGateTen
MapIcon::EnergyGateEight
MapIcon::EnergyGateSix
MapIcon::EnergyGateFour
MapIcon::SpiritShard
MapIcon::NPC
MapIcon::QuestItem
MapIcon::ShardSlotUpgrade
MapIcon::Teleporter
MapIcon::Ore
MapIcon::QuestStart
MapIcon::QuestEnd
MapIcon::RaceStart
MapIcon::HealthFragment
MapIcon::EnergyFragment
MapIcon::Seed
MapIcon::RaceEnd
MapIcon::Eyestone
MapIcon::WatermillDoor
MapIcon::TempleDoor
MapIcon::SmallDoor
MapIcon::Shrine
MapIcon::Loremaster
MapIcon::Weaponmaster
MapIcon::Gardener
MapIcon::Mapmaker
MapIcon::Shardtrader
MapIcon::Wanderer
MapIcon::Treekeeper
MapIcon::Builder
MapIcon::Kwolok
MapIcon::Statistician
MapIcon::CreepHeart
MapIcon::Miner
MapIcon::Spiderling
MapIcon::Moki
MapIcon::MokiBrave
MapIcon::MokiAdventurer
MapIcon::MokiArtist
MapIcon::MokiDarkness
MapIcon::MokiFashionable
MapIcon::MokiFisherman
MapIcon::MokiFrozen
MapIcon::MokiKwolokAmulet
MapIcon::MokiSpyglass
MapIcon::Ku
MapIcon::IceFisher
MapIcon::Siira
MapIcon::SavePedestalInactive
MapIcon::RaceStartUnfinished
MapIcon::CleanWater
MapIcon::BonusItem
MapIcon::LaunchFragment
MapIcon::PurpleFloor
MapIcon::PurpleWall
MapIcon::YellowWall
MapIcon::OneWayWallLeft
MapIcon::OneWayWallRight
MapIcon::IceWall
MapIcon::IceFloor
MapIcon::VerticalDoor
MapIcon::HorizontalDoor
MapIcon::Lever
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
