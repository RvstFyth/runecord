const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const emojisHelper = require('../helpers/emojis');
const questsHelper = require('../helpers/quests');
const random = require('../helpers/random');
const usersLockModel = require('../models/usersLocks');

module.exports = {
    async run(msg, args, data) {
        const locationDetails = areasHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (
            !locationDetails.commands ||
            (locationDetails.commands && !locationDetails.commands.fish)
        )
            return msg.channel.send(
                `**${data.user.name}** you can't fish here?!?`
            );

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to fish with?!?`
            );
        if (!locationDetails.commands.fish[args[0]])
            return msg.channel.send(
                `**${data.user.name}** you can't fish with a ${args[0]} here..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        if (occupiedSlots >= 28)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

        const rewards = Object.values(
            locationDetails.commands.fish[args[0]]
        ).filter((o) => o.level <= data.char.skills.fishing.level);

        const reward = random.arrayValue(rewards);

        const xpGain = await data.char.skills.fishing.addXp(
            reward.xp,
            data.user.area === 'tutorial' ? 3 : false
        );
        await inventoryModel.add(data.user.id, reward.id, 1);

        const item = await itemsModel.get(reward.id);

        const em = await emojisHelper.get(msg.client, 'fishing');
        const embed = {
            description: `**${data.user.name}** you cast out your net..`,
            // description: `**${data.user.name}** caught a ${item.name} ${em} +${xpGain}`,
        };

        const lockID = await usersLockModel.create(
            data.user.id,
            ` You are still fishing..`,
            -1
        );
        msg.channel
            .send({ embed })
            .then(async (message) => {
                const chance = Math.min(data.char.skills.fishing.level, 100);
                while (true) {
                    if (random.number(1, 100) <= chance) {
                        embed.description = `**${data.user.name}** caught a ${item.name} ${em} +${xpGain}`;
                        await usersLockModel.delete(lockID);
                        await questsHelper.check(
                            'fish',
                            item.name,
                            1,
                            data.user,
                            msg
                        );
                        return message.edit({ embed });
                    }

                    await new Promise((resolve) => setTimeout(resolve, 600));
                }
            })
            .catch((e) => console.log(e));
    },
};
