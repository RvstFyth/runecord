const inventoryModel = require('../models/usersInventory');
const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');
const questHelper = require('../helpers/quests');
const emojisHelper = require('../helpers/emojis');

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

        const xpGain = await data.char.skills.mining.addXp(
            result.xp,
            data.user.area === 'tutorial' ? 3 : false
        );

        await inventoryModel.add(data.user.id, result.id, 1);

        await questHelper.check('mine', args[0], 1, data.user, msg);

        const em = await emojisHelper.get(msg.client, 'mining');
        const embed = {
            description: `**${data.user.name}** got 1 ${result.label} ${em} +${xpGain}`,
        };
        return msg.channel.send({ embed });
    },
};
