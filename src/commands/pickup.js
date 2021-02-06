const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const worldsHelper = require('../helpers/worlds');

module.exports = {
    aliasses: ['pu'],

    async run(msg, args, data) {
        let amount = 1;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to pickup?!?`
            );

        const input = args.join(' ');

        const objects = worldsHelper.getObjectsOnLocation(
            data.user.world,
            data.user.area,
            data.user.location
        );
        const requested = objects.filter((o) => o.name.toLowerCase() === input);
        if (!requested.length)
            return msg.channel.send(
                `**${data.user.name}** there is no ${input} to pickup..`
            );

        const itemRecord = await itemsModel.getForName(input);
        if (!itemRecord)
            return msg.channel.send(
                `**${data.user.name}** you can not pickup ${input}`
            );

        const inventoryCount = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        const freeSlots = 28 - parseInt(inventoryCount);
        if (freeSlots < 1)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );
        if (amount > freeSlots) amount = freeSlots;
        if (amount > requested.length) amount = requested.length;

        for (let i = 0; i < amount; i++)
            worldsHelper.removeObjectFromWorld(
                data.user.world,
                input,
                data.user.area,
                data.user.location
            );

        await inventoryModel.add(data.user.id, itemRecord.id, amount);
        return msg.channel.send(
            `**${data.user.name}** picked up ${amount} x ${itemRecord.name}`
        );
    },
};
