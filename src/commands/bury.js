const inventoryModel = require('../models/usersInventory');
const emojiHelper = require('../helpers/emojis');

module.exports = {
    async run(msg, args, data) {
        const bones = await inventoryModel.getFor(data.user.id, 53);
        if (!bones[0] || bones[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you don't have any bones..`
            );

        await inventoryModel.delete(bones[0].id);
        const xpGain = await data.char.skills.prayer.addXp(
            4,
            data.user.area === 'tutorial' ? 3 : false
        );

        const em = await emojiHelper.get(msg.client, 'prayer');

        const embed = {
            description: `**${data.user.name}** buried bones ${em} +${xpGain}`,
        };
        return msg.channel.send({ embed });
    },
};
