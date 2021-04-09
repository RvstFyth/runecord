const inventoryModel = require('../models/usersInventory');
const areasHelper = require('../helpers/areas');
const questHelper = require('../helpers/quests');
const emojisHelper = require('../helpers/emojis');
const random = require('../helpers/random');
const usersLockModel = require('../models/usersLocks');

const gems = {
    sapphire: {
        id: 121,
        label: 'Uncut sapphire',
    },
};

module.exports = {
    async run(msg, args, data) {
        const locationDetails = areasHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (
            !locationDetails.commands ||
            (locationDetails.commands && !locationDetails.commands.mine)
        )
            return msg.channel.send(
                `**${data.user.name}** there nothing to mine here?!?`
            );

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to mine?!?`
            );
        if (!locationDetails.commands.mine[args[0]])
            return msg.channel.send(
                `**${data.user.name}** you can't mine ${args[0]} here..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        if (occupiedSlots >= 28)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

        const pickaxe = await inventoryModel.getWithTypeAndHighestLevel(
            data.user.id,
            'pickaxe'
        );
        if (!pickaxe || pickaxe.amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you have to carry a pickaxe for this..`
            );

        const result = { ...locationDetails.commands.mine[args[0]] };

        if (result.level && result.level > data.char.skills.mining.level)
            return msg.channel.send(
                `**${data.user.name}** you need mining level ${result.level} for this...`
            );

        const em = await emojisHelper.get(msg.client, 'mining');
        const embed = {
            description: `**${data.user.name}** started to mine..`,
        };
        const lockID = await usersLockModel.create(
            data.user.id,
            ` You are still mining..`,
            -1
        );

        return msg.channel.send({ embed }).then(async (message) => {
            const chance = 3 + Math.min(data.char.skills.mining.level, 100);
            while (true) {
                if (random.number(1, 100) <= chance) {
                    await usersLockModel.delete(lockID);
                    const xpGain = await data.char.skills.mining.addXp(
                        result.xp,
                        data.user.area === 'tutorial' ? 3 : false
                    );
                    const gemChance = random.number(1, 256);
                    if (random.number(1, 256) === gemChance) {
                        const g = random.arrayValue(Object.values(gems));
                        embed.description = `**${data.user.name}** got luck and got a ${g.label} ${em} +${xpGain}`;
                        await inventoryModel.add(data.user.id, g.id, 1);
                    } else {
                        embed.description = `**${data.user.name}** got 1 ${result.label} ${em} +${xpGain}`;
                        await inventoryModel.add(data.user.id, result.id, 1);
                    }

                    await questHelper.check('mine', args[0], 1, data.user, msg);
                    return msg.channel.send({ embed });
                }

                await new Promise((resolve) => setTimeout(resolve, 600));
            }
        });
    },
};
