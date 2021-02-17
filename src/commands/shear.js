const inventoryModel = require('../models/usersInventory');
const areasHelper = require('../helpers/areas');
const questsHelper = require('../helpers/quests');

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to shear?!?`
            );

        const locationDetails = areasHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (
            !locationDetails.commands ||
            (locationDetails.commands && !locationDetails.commands.shear)
        )
            return msg.channel.send(
                `**${data.user.name}** there is nothing to shear here?!?`
            );

        if (!locationDetails.commands.shear[args[0]])
            return msg.channel.send(
                `**${data.user.name}** you can't shear ${args[0]} here..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        if (occupiedSlots >= 28)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

        const shears = await inventoryModel.getFor(data.user.id, 68);
        if (!shears[0] || shears[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you need shears for this..`
            );

        await questsHelper.check('shear', args[0], 1, data.user, msg);
        await inventoryModel.add(
            data.user.id,
            locationDetails.commands.shear[args[0]].id,
            1
        );

        return msg.channel.send(
            `**${data.user.name}** got 1 x ${
                locationDetails.commands.shear[args[0]].label
            }`
        );
    },
};
