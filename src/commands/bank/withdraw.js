const bankModel = require('../../models/usersBank');
const inventoryModel = require('../../models/usersInventory');
const itemsModel = require('../../models/items');
const areaHelper = require('../../helpers/areas');

module.exports = {
    aliasses: ['bwith', 'bget'],

    async run(msg, args, data) {
        const locationData = areaHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (!locationData.tools || locationData.tools.indexOf('bank') < 0)
            return msg.channel.send(
                `**${data.user.name}** you need to be at a bank for this command..`
            );
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to withdraw?!?`
            );

        let amount = 1;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }
        const input = args.join(' ');

        const item = await itemsModel.getForName(input);
        if (!item)
            return msg.channel.send(
                `**${data.user.name}** there is no item with the name ${input}..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        const freeSlots = 28 - occupiedSlots;
        if (freeSlots < 1)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );
        if (amount > freeSlots) amount = freeSlots;

        const bankRecord = await bankModel.getFor(data.user.id, item.id);
        if (!bankRecord || bankRecord.amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you don't have any ${input} in your bank..`
            );
        if (amount > bankRecord.amount) amount = bankRecord.amount;

        await inventoryModel.add(data.user.id, item.id, amount);
        await bankModel.setAmount(
            data.user.id,
            item.id,
            parseInt(bankRecord.amount) - amount
        );

        return msg.channel.send(
            `**${data.user.name}** took ${amount} x ${item.name} from their bank..`
        );
    },
};
