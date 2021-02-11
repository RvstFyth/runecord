const inventoryModel = require('../models/usersInventory');

module.exports = {
    async run(msg, args, data) {
        const bones = await inventoryModel.getFor(data.user.id, 53);
        if (!bones[0] || bones[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you don't have any bones..`
            );

        await inventoryModel.delete(bones[0].id);
        data.char.skills.prayer.addXp(4);
        return msg.channel.send(
            `**${data.user.name}** buried bones and got 4 xp!`
        );
    },
};
