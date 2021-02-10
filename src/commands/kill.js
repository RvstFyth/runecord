const areasHelper = require('../helpers/areas');
const combatHelper = require('../helpers/combat');
const characterHelper = require('../helpers/character');
const skillsHelper = require('../helpers/skills');
const random = require('../helpers/random');
const itemsModel = require('../models/items');
const worldsHelper = require('../helpers/worlds');

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

        if (!locationData.mobs[input])
            return msg.channel.send(
                `**${data.user.name}** there is no ${input} at this location..`
            );

        const npc = characterHelper.composeNPC(input, locationData.mobs[input]);
        const char = data.char;
        const result = await combatHelper.simulateAgaianstNpc(char, npc);

        if (result.player.health > 0) {
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
            for (let i in locationData.mobs[input].loot) {
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

            return msg.channel
                .send(`**${data.user.name}** won against ${input}`)
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
        } else
            return msg.channel.send(
                `**${data.user.name}** lost against ${input}`
            );
    },
};
