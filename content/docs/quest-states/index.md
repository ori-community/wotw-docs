---
title: Quest States
---

Will of the Wisps implements quests using integer [UberStates](/docs/seedlang#uberstates).

Those quest states begin at 0 ("not started") and increment with every step you complete.

## The Missing Key

- Vanilla name: `npcsStateGroup.marshKeystoneQuest`
- Identifier: `48248|51645`

### Steps {#the-missing-key-steps}

#### `🠖 1` {#the-missing-key-step-1}

##### Alias

`Marsh.MissingKey.Started`

##### Prerequisites

- Talk to Tokk in the cave

#### `🠖 2` {#the-missing-key-step-2}

##### Alias

`Marsh.MissingKey.KeystoneCollected`

##### Quest Objective

Find the Keystone

##### Prerequisites

- Previous step: `npcsStateGroup.marshKeystoneQuest == 1`
- Keystone pickup `Marsh.TokkCave.LeftKS` / `swampStateGroup.swampWalljumpChallengeBKeystoneBCollected`

#### `🠖 3` {#the-missing-key-step-3}

##### Alias

`Marsh.MissingKey.Completed`

##### Quest Objective

Show the keystone to Tokk

##### Prerequisites

- Keystone pickup: `Marsh.TokkCave.LeftKS` / `swampStateGroup.swampWalljumpChallengeBKeystoneBCollected`
- Talk to Tokk

Additionally, when talking to Tokk outside of the cave:

- Previous step: `npcsStateGroup.marshKeystoneQuest == 2`

##### Notes

If you travel through the cave coming from the right, you may want to talk to Tokk as you pass him. This way you can meet the prerequisites to complete the quest at any Tokk without returning to the cave entrance.

## Guardian of the Marsh

- Vanilla name: `questUberStateGroup.findToadQuestUberState`
- Identifier: `14019|48794`

### Steps {#guardian-of-the-marsh-steps}

#### `🠖 1` {#guardian-of-the-marsh-step-1}

##### Prerequisites

- Watch the moki cutscene after Sword tree

#### `🠖 2` {#guardian-of-the-marsh-step-2}

##### Quest Objective

Find Kwolok

##### Prerequisites

<!-- TODO -->

## The Silent Teeth

- Vanilla name: `kwolokGroupDescriptor.cleanseWellspringQuestUberState`
- Identifier: `937|34641`

### Steps {#the-silent-teeth-steps}

#### `🠖 1` {#the-silent-teeth-step-1}

##### Alias

`Hollow.SilentTeeth.Started`

##### Prerequisites

- Find Kwolok in Hollow

##### Notes

This step is set in the same cutscene as `Hollow.Wisp` / `kwoloksCavernThroneRoomGroup.wispRewardPickup` and the corresponding energy and life increase.

#### `🠖 2` {#the-silent-teeth-step-2}

##### Alias

`Wellspring.SilentTeeth.EnterCutscene`

##### Quest Objective

Restart the Mill

##### Prerequisites

- Watch the cutscene in front of Wellspring

#### `🠖 3` {#the-silent-teeth-step-3}

##### Alias

`Wellspring.SilentTeeth.SoSoggy`

##### Quest Objective

Search the Mill

##### Prerequisites

- Finish water escape

<!-- TODO quest notes mention that you need `waterMillStateGroupDescriptor.finishedWatermillEscape` and some scene? which scene? could not reproduce... -->

##### Notes

This step is set in the same cutscene as `waterMillStateGroupDescriptor.finishedWatermillEscape`, which controls whether the water deals damage in vanilla and `waterMillStateGroupDescriptor.watermillEscapeState 🠖 2`, which controls the visuals of some waters in vanilla. `kwolokGroupDescriptor.cleanseWellspringQuestUberState >= 3` itself controls the visuals of some other waters in vanilla. Rando overrides all of these with one `worldEvents.cleanWater` state.

The vanilla implementation for this quest step is very questionable! It performs the following actions during the cutscene:

- set `waterMillStateGroupDescriptor.watermillEscapeState` to 2
- falling cutscene
- set `waterMillStateGroupDescriptor.finishedWatermillEscape` to true
- soggy cutscene
- increment `kwolokGroupDescriptor.cleanseWellspringQuestUberState` by 1
- save
- if `kwolokGroupDescriptor.cleanseWellspringQuestUberState` is 2, set it to 3

As you may imagine, this does not always produce the correct result :origdi:

This is relevant in speedruns where the cutscene in front of Wellspring is skipped, so <code>kwolokGroupDescriptor.<wbr>cleanseWellspringQuestUberState</code> is at 1 at the end of the escape. Moon implemented the last step as a "fix" for this situation, but it happens after saving, so if you die after the escape before having saved again, the quest state gets reset to 2, which leaves some waters visually unclean.

Rando fixes this softlock by ensuring the quest state is never lower than 3 after the escape.

As an aside, if you find a way to enter the escape multiple times, you can finish the quest right there, without going to Hollow :orilol:

#### `🠖 4` {#the-silent-teeth-step-4}

##### Alias

`Hollow.SilentTeeth.Completed`

##### Quest Objective

Return to Kwolok

##### Prerequisites

- Previous step: `kwolokGroupDescriptor.cleanseWellspringQuestUberState == 3`
- Visit Kwolok in Hollow

## Fallen Friend

- Vanilla name: `questUberStateGroup.findKuQuest`
- Identifier: `14019|34504`

### Steps {#fallen-friend-steps}

#### `🠖 1` {#fallen-friend-step-1}

#### `🠖 2` {#fallen-friend-step-2}

#### `🠖 3` {#fallen-friend-step-3}

#### `🠖 4` {#fallen-friend-step-4}

##### Quest Objective

Leave the Silent Woods

## The Will of the Wisps

## The Highest Reach

- Vanilla name: `questUberStateGroup.winterForestWispQuestUberState`
- Identifier: `14019|8973`

### Steps {#the-highest-reach-steps}

#### `🠖 1` {#the-highest-reach-step-1}

#### `🠖 2` {#the-highest-reach-step-2}

##### Quest Objective

Find the Memory of the Forest

#### `🠖 3` {#the-highest-reach-step-3}

## Lost in Paradise

- Vanilla name: `questUberStateGroup.lagoonWispQuestUberState`
- Identifier: `14019|35087`

### Steps {#lost-in-paradise-steps}

#### `🠖 1` {#lost-in-paradise-step-1}

#### `🠖 3` {#lost-in-paradise-step-3}

##### Quest Objective

Find the Strength of the Forest

## Breaking the Mould

- Vanilla name: `questUberStateGroup.mouldwoodDepthsWispQuestUberState`
- Identifier: `14019|45931`

### Steps {#breaking-the-mould-steps}

#### `🠖 1` {#breaking-the-mould-step-1}

#### `🠖 3` {#breaking-the-mould-step-3}

##### Quest Objective

Find the Eyes of the Forest

## Beneath Shifting Sands

- Vanilla name: `questUberStateGroup.desertWispQuestUberState`
- Identifier: `14019|35399`

### Steps {#beneath-shifting-sands-steps}

#### `🠖 1` {#beneath-shifting-sands-step-1}

#### `🠖 3` {#beneath-shifting-sands-step-3}

##### Quest Objective

Find the Heart of the Forest

## A Little Braver

## Into the Burrows

## The Lost Compass

## Into the Darkness

## Family Reunion

## The Tree Keeper

## Kwolok's Wisdom

## A Diamond in the Rough

## Hand To Hand

## Rebuilding the Glades

## Regrowing the Glades
