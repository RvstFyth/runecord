const itemsModel = require('../models/items');
const inventoryModel = require('../models/usersInventory');
const usersModel = require('../models/users');

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to eat?!?`
            );

        const input = args.join(' ');
        const item = await itemsModel.getForName(input);
        if (!item)
            return msg.channel.send(
                `**${data.user.name}** there is no item named ${item}..`
            );
        if (item.type !== 'consumable')
            return msg.channel.send(
                `**${data.user.name}** you can't eat ${item}..`
            );

        const userItems = await inventoryModel.getFor(data.user.id, item.id);
        if (!userItems[0] || userItems[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you don't have any ${input}..`
            );

        if (userItems[0].amount > 1) {
            await inventoryModel.setAmount(
                userItems[0].id,
                parseInt(userItems[0].amount) - 1
            );
        } else {
            await inventoryModel.delete(userItems[0].id);
        }

        const metaParsed = JSON.parse(item.meta);

        let result = `${data.user.name} ate ${item.name}`;
        if (metaParsed.hitpoints) {
            const newHealth = Math.min(
                parseInt(data.user.health) + metaParsed.hitpoints,
                data.char.skills.hitpoints.level
            );
            const recoveredHealth = newHealth - parseInt(data.user.health);

            await usersModel.setHealth(data.user.id, newHealth);
            if (recoveredHealth > 0)
                result += `\n- +${recoveredHealth} hitpoints`;
        }

        return msg.channel.send(result);
    },
};
