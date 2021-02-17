const areasHelper = require('../helpers/areas');
const itemsModel = require('../models/items');
const emojiHelper = require('../helpers/emojis');
const inventoryModel = require('../models/usersInventory');
const usersModel = require('../models/users');
const valuesHelper = require('../helpers/values');
const input = require('../helpers/input');

module.exports = {
    async run(msg, args, data) {
        const npcs = Object.values(
            areasHelper.getLocation(data.user.area, data.user.location).npcs
        );
        let npc;
        if (npcs && npcs[args[0] - 1]) {
            npc = npcs[args[0] - 1];
            args = args.splice(1);
        }
        if (!npc)
            return msg.channel.send(`**${data.user.name}** NPC not found..`);
        if (!npc.shop)
            return msg.channel.send(
                `**${data.user.name}** this NPC has no shop..`
            );

        let amount = 1;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to sell?!?`
            );

        const item = await itemsModel.getForName(args.join(' '));
        if (!item)
            return msg.channel.send(
                `**${data.user.name}** there is no item named ${args.join(
                    ' '
                )}..`
            );

        const userItems = await inventoryModel.getFor(data.user.id, item.id);
        if (!userItems || !userItems.length)
            return msg.channel.send(
                `**${data.user.name}** you don't have any ${item.name}..`
            );
        const userHas = valuesHelper.sumArray(userItems.map((u) => u.amount));

        if (amount > userHas) amount = userHas;
        const price = parseInt(item.price) * amount;

        const em = await emojiHelper.get(msg.client, 'gold');
        const confirmed = await input.askUserToConfirm(
            `**${data.user.name}**\nConfirm to sell ${amount} x ${item.name} for ${em} ${price}`,
            msg
        );

        if (confirmed) {
            let amountToDeplete = amount;
            for (let i in userItems) {
                const rAmount = parseInt(userItems[i].amount);
                if (rAmount > amount)
                    await inventoryModel.setAmount(
                        userItems[i].id,
                        rAmount - amount
                    );
                else await inventoryModel.delete(userItems[i].id);
                amountToDeplete -= rAmount;
                if (amountToDeplete < 1) break;
            }

            if (price > 0) await usersModel.addGold(data.user.id, price);

            const embed = {
                description: `It was a pleasure doing business with you!\n${em} ${price}`,
                title: npc.label,
            };
            const files = [];

            if (npc.chatHead) {
                files.push({
                    attachment: `./assets/images/npcs/${npc.chatHead}`,
                    name: npc.chatHead,
                });
                embed.thumbnail = {
                    url: `attachment://${npc.chatHead}`,
                };
            }

            return msg.channel.send({ embed, files });
        }
    },
};
