const areasHelper = require('../helpers/areas');
const combatHelper = require('../helpers/combat');
const characterHelper = require('../helpers/character');
const skillsHelper = require('../helpers/skills');
const random = require('../helpers/random');
const itemsModel = require('../models/items');
const worldsHelper = require('../helpers/worlds');
const usersModel = require('../models/users');
const questsHelper = require('../helpers/quests');
const valuesHelper = require('../helpers/values');

const logEmoji = '📖';

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** please specify a mob to attack..`
            );

        const input = args.join(' ');
        const locationData = await areasHelper.getLocation(
            data.user.area,
            data.user.location
        );

        let mobs = worldsHelper.getMobs(
            data.user.world,
            data.user.area,
            data.user.location
        );
        if (!mobs[input])
            return msg.channel.send(
                `**${data.user.name}** there is no ${input} at this location..`
            );

        const filteredMobs = mobs[input].filter(
            (m) => m.mob.health > 0 && !m.occupied
        );
        if (!filteredMobs || !filteredMobs.length)
            return msg.channel.send(
                `**${data.user.name}** there is no ${input} here right now..`
            );

        const npc = filteredMobs[0].mob;
        filteredMobs[0].occupied = true;
        const char = await characterHelper.composeFromUserRecord(data.user);
        const result = await combatHelper.simulateAgaianstNpc(char, npc);
        filteredMobs[0].occupied = false;

        if (result.npc.health < 1) {
            filteredMobs[0].diedTimestamp = valuesHelper.currentTimestamp();
        }

        if (result.player.health > 0) {
            await usersModel.setHealth(
                data.user.id,
                Math.min(
                    result.player.health,
                    result.player.skills.hitpoints.level
                )
            );
            let xpGain = 0;
            xpGain = parseInt(
                locationData.mobs[input].stats.combat.hitpoints * 4
            );
            // return msg.channel.send(xpGain)
            const hpXpGain = parseInt(
                locationData.mobs[input].stats.combat.hitpoints * 1.33
            );

            switch (char.attackStyle) {
                case 'accurate':
                    if (
                        char.area !== 'tutorial' ||
                        char.skills.attack.xp + xpGain <
                            skillsHelper.xpForLevel(3)
                    )
                        await char.skills.attack.addXp(xpGain);
                    break;
                case 'aggressive':
                    if (
                        char.area !== 'tutorial' ||
                        char.skills.strength.xp + xpGain <
                            skillsHelper.xpForLevel(3)
                    )
                        await char.skills.strength.addXp(xpGain);
                    break;
                case 'defensive':
                    if (
                        char.area !== 'tutorial' ||
                        char.skills.defence.xp + xpGain <
                            skillsHelper.xpForLevel(3)
                    )
                        await char.skills.defence.addXp(xpGain);
                    break;
                case 'controlled':
                    xpGain = parseInt(xpGain * 1.33);
                    if (
                        char.area !== 'tutorial' ||
                        char.skills.attack.xp + xpGain <
                            skillsHelper.xpForLevel(3)
                    )
                        await char.skills.attack.addXp(xpGain);
                    if (
                        char.area !== 'tutorial' ||
                        char.skills.strength.xp + xpGain <
                            skillsHelper.xpForLevel(3)
                    )
                        await char.skills.strength.addXp(xpGain);
                    if (
                        char.area !== 'tutorial' ||
                        char.skills.defence.xp + xpGain <
                            skillsHelper.xpForLevel(3)
                    )
                        await char.skills.defence.addXp(xpGain);
                    break;
            }
            if (
                char.area !== 'tutorial' ||
                char.skills.hitpoints.xp + hpXpGain < skillsHelper.xpForLevel(3)
            )
                await char.skills.hitpoints.addXp(hpXpGain);

            // Loot drops
            if (locationData.mobs[input].loot.gold) {
                const goldAmount = random.number(
                    locationData.mobs[input].loot.gold.min,
                    locationData.mobs[input].loot.gold.max
                );
                await usersModel.addGold(data.user.id, goldAmount);
            }
            for (let i in locationData.mobs[input].loot) {
                if (i === 'gold') continue;
                let valid =
                    locationData.mobs[input].loot[i].chance < 100
                        ? random.chance(locationData.mobs[input].loot[i].chance)
                        : true;
                if (valid) {
                    const item = await itemsModel.get(i);
                    const amount = random.number(
                        locationData.mobs[input].loot[i].min,
                        locationData.mobs[input].loot[i].max
                    );
                    for (let i = 0; i < amount; i++) {
                        worldsHelper.addObjectToWorld(
                            data.user.world,
                            item.name,
                            data.user.area,
                            data.user.location
                        );
                    }
                }
            }
            await questsHelper.check('kill', input, 1, data.user, msg);
            const hearthEmoji = msg.client.emojis.cache.get(
                '810245315860496415'
            );
            const embed = {
                title: `${data.user.name}`,
                fields: [
                    {
                        name: char.name,
                        value: `${hearthEmoji} ${char.health}/${char.skills.hitpoints.level}`,
                        inline: true,
                    },
                    {
                        name: npc.name,
                        value: `${hearthEmoji} 0/${npc.skills.hitpoints.level}`,
                        inline: true,
                    },
                ],
            };
            return msg.channel.send({ embed }).then(async (message) => {
                await message.react(logEmoji);
                const filter = (reaction, user) => {
                    return (
                        reaction.emoji.name === logEmoji &&
                        user.id === msg.author.id
                    );
                };
                message
                    .awaitReactions(filter, { max: 1, time: 30 * 1000 })
                    .then((collected) => {
                        const reaction = collected.first();
                        if (reaction) {
                            let description = '';
                            for (let i of result.log) {
                                description += `- ${i}\n`;
                            }
                            const embed = {
                                title: `${data.user.name}'s combat log`,
                                description,
                            };
                            return msg.channel.send({ embed });
                        }
                    });
            });
        } else await usersModel.setHealth(data.user.id, 0);
        return msg.channel
            .send(`**${data.user.name}** lost against ${input}`)
            .then(async (message) => {
                await message.react(logEmoji);
                const filter = (reaction, user) => {
                    return (
                        reaction.emoji.name === logEmoji &&
                        user.id === msg.author.id
                    );
                };
                message
                    .awaitReactions(filter, { max: 1, time: 30 * 1000 })
                    .then((collected) => {
                        const reaction = collected.first();
                        if (reaction) {
                            let description = '';
                            for (let i of result.log) {
                                description += `- ${i}\n`;
                            }
                            const embed = {
                                title: `${data.user.name}'s combat log`,
                                description,
                            };
                            return msg.channel.send({ embed });
                        }
                    });
            });
    },
};
