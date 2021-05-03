const inventoryModel = require('../models/usersInventory');
const emojiHelper = require('../helpers/emojis');

const itemsMapping = {
    sapphire: {
        level: 20,
        xp: 50,
        id: 122,
        requires: 121,
    },
};

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to cut?!?`
            );

        const chisels = await inventoryModel.getFor(data.user.id, 73);
        if (!chisels || !chisels[0] || chisels[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you need a chisel in your inventory for this...`
            );

        const input = args.join(' ');
        if (!itemsMapping[input])
            return msg.channel.send(
                `**${data.user.name}** you can't cut a ${input}..`
            );

        const item = itemsMapping[input];
        if (data.char.skills.crafting.level < item.level)
            return msg.channel.send(
                `**${data.user.name}** you need level ${item.level} for this..`
            );
        const requiredItem = await inventoryModel.getFor(
            data.user.id,
            item.requires
        );
        if (!requiredItem[0] || requiredItem[0].amount < 1) {
            return msg.channel.send(
                `**${data.user.name}** you don't have the materials required for this...`
            );
        }

        await inventoryModel.delete(requiredItem[0].id);
        await inventoryModel.add(data.user.id, item.id, 1);
        const em = await emojiHelper.get(msg.client, 'crafting');
        const xpGain = await data.char.skills.crafting.addXp(item.xp);
        const embed = {
            description: `**${data.user.name}** cut a ${input}! +${xpGain}${em}`,
        };
        return msg.channel.send({ embed });
    },
};
