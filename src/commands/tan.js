// [name] gave the tanner [amount] x [ingredient], and received [amount] x [result] for [amount] gold
const inventoryModel = require('../models/usersInventory');
const usersModel = require('../models/users');
const fs = require('fs');
const areasHelper = require('../helpers/areas');
const itemsModel = require('../models/items');

const mapping = {
    leather: {
        required: 57,
        result: 112,
        cost: 1,
    },
};

module.exports = {
    async run(msg, args, data) {
        const tanner = areasHelper.getNpcFortype(
            data.user.area,
            data.user.location,
            'tanner'
        );
        if (!tanner)
            return msg.channel.send(
                `**${data.user.name}** there is no tanner at this location...`
            );

        const embed = {
            title: tanner.label,
        };

        const files = [];
        if (
            tanner.chatHead &&
            fs.existsSync(`./assets/images/npcs/${tanner.chatHead}`)
        ) {
            files.push({
                attachment: `./assets/images/npcs/${tanner.chatHead}`,
                name: tanner.chatHead,
            });
            embed.thumbnail = {
                url: `attachment://${tanner.chatHead}`,
            };
        }

        let amount = 1,
            item;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            item = args.splice(1).join(' ');
        } else item = args[0];

        if (!item)
            embed.description = `What do you want me to tan for you?\n\nExample: \`${data.prefix}tan 2 leather\``;
        if (!mapping[item])
            embed.description = `I'm sorry, but that's something i can't do for you. Please specify a valid item to tan for you..`;
        if (embed.description) return msg.channel.send({ embed, files });
        const cost = amount * mapping[item].cost;
        if (cost > data.user.gold) {
            embed.description = `You don't have enough gold coins for this. You need ${cost} gold coins..`;
            return msg.channel.send({ embed, files });
        }

        const userRecord = await inventoryModel.getFor(
            data.user.id,
            mapping[item].required
        );
        const requiredItem = await itemsModel.get(mapping[item].required);
        if (!userRecord || userRecord.length < 1)
            embed.description = `You dont carry the materials required for this. You have to bring me ${requiredItem.name} and ${mapping[item].cost} x gp, per item, to turn into ${item}`;
        else {
            await usersModel.setGold(
                data.user.id,
                parseInt(data.user.gold) - cost
            );
            if (amount > userRecord.length) amount = userRecord.length;

            for (let i = 0; i < amount; i++) {
                await inventoryModel.delete(userRecord[i].id);
            }

            await inventoryModel.add(
                data.user.id,
                mapping[item].result,
                amount
            );

            embed.description = `Here is your ${item}, hope to see you again soon!`;
        }

        return msg.channel.send({ embed, files });
    },
};
