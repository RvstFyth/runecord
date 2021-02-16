const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const emojisHelper = require('../helpers/emojis');

const itemMapping = {
    logs: {
        arrowshaft: {
            id: 63,
            consumes: 1,
            required: 62,
            level: 1,
            amount: 15,
            xp: 5,
            ticks: 2,
        },
    },
};

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to fletch with?!?`
            );

        const sourceItem = args[0];
        if (!itemMapping[sourceItem])
            return msg.channel.send(
                `**${data.user.name}** you can't fletch with ${args[0]}..`
            );

        args = args.splice(1);
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to fletch?!?`
            );

        const input = args.join(' ');
        if (!itemMapping[sourceItem][input.replace(' ', '')])
            return msg.channel.send(
                `**${data.user.name}** you can't fletch ${input}...`
            );

        const result = itemMapping[sourceItem][input.replace(' ', '')];
        if (data.char.skills.fletching.level < result.level)
            return msg.channel.send(
                `**${data.user.name}** you need to have fletching level ${result.level} for this..`
            );

        const tool = await itemsModel.get(result.required);
        const userTool = await inventoryModel.getFor(data.user.id, tool.id);
        if (!userTool[0] || userTool[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you need a ${tool.name} for this..`
            );

        const userSourceItems = await inventoryModel.getFor(
            data.user.id,
            result.consumes
        );
        if (!userSourceItems[0] || userSourceItems[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you don't have any ${sourceItem}..`
            );

        await inventoryModel.delete(userSourceItems[0].id);

        const resultItem = await itemsModel.get(result.id);
        await inventoryModel.add(data.user.id, resultItem.id, result.amount);
        const xpGain = await data.char.skills.fletching.addXp(
            result.xp,
            data.user.area === 'tutorial' ? 3 : false
        );

        const em = await emojisHelper.get(msg.client, 'fletching');
        const embed = {
            description: `**${data.user.name}**'s fletch result\n+ ${result.amount} x ${resultItem.name}\n ${em} +${xpGain}`,
        };

        return msg.channel.send({ embed });
    },
};
