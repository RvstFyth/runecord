const areasHelper = require('../helpers/areas');
const itemsModel = require('../models/items');
const emojiHelper = require('../helpers/emojis');
const inventoryModel = require('../models/usersInventory');
const usersModel = require('../models/users');
const input = require('../helpers/input');

module.exports = {
    async run(msg, args, data) {
        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        if (occupiedSlots >= 28)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

        const npcs = Object.values(
            areasHelper.getLocation(data.user.area, data.user.location).npcs
        );
        let npc, npcIndex;
        if (npcs && npcs[args[0] - 1]) {
            npc = npcs[args[0] - 1];
            npcIndex = args[0];
            args = args.splice(1);
        }
        if (!npc)
            return msg.channel.send(`**${data.user.name}** NPC not found..`);
        if (!npc.shop)
            return msg.channel.send(
                `**${data.user.name}** this NPC has no shop..`
            );

        const embed = { description: ``, title: npc.label };
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

        let itemIndex,
            amount = 1;
        if (args[0]) {
            if (args[1]) {
                amount = parseInt(args[0]);
                itemIndex = parseInt(args[1]) - 1;
                args = args.splice(1);
            } else itemIndex = parseInt(args[0]) - 1;

            let item, shopItem;
            if (!isNaN(args[0])) {
                shopItem = npc.shop[itemIndex];
                if (shopItem)
                    item = await itemsModel.get(npc.shop[itemIndex].id);
            } else {
                item = await itemsModel.getForName(args.join(' '));
                shopItem = npc.shop.filter(
                    (r) => r.id === parseInt(item.id)
                )[0];
            }

            if (!shopItem) {
                embed.description = `**${data.user.name}**\n i don't sell this item. You can see what i offer with the \`${data.prefix}shop ${npcIndex}\` command`;
                return msg.channel.send({ embed, files });
            }

            // check if amount > free slots, if so amount = free slots
            const freeSlots = 28 - occupiedSlots;
            if (!item.stacks && amount > freeSlots) amount = freeSlots;

            const price = shopItem.price * amount;
            if (price > data.user.gold) {
                embed.description = `**${data.user.name}**, you can't afford this..`;
                return msg.channel.send({ embed, files });
            }

            const em = await emojiHelper.get(msg.client, 'gold');

            const confirmed = await input.askUserToConfirm(
                `**${data.user.name}**\nConfirm to buy ${amount} x ${item.name} for ${em} ${price}`,
                msg
            );
            if (confirmed) {
                await usersModel.setGold(
                    data.user.id,
                    parseInt(data.user.gold) - price
                );
                await inventoryModel.add(data.user.id, shopItem.id, amount);

                embed.description = `**${data.user.name}**, it was my pleasure doing business with you!\n\n+ ${amount} x ${item.name}\n-${em} ${price}`;
                return msg.channel.send({ embed, files });
            }
        } else
            return msg.channel.send(`**${data.user.name}** invalid syntax..`);
    },
};
