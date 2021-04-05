// [name] gave the tanner [amount] x [ingredient], and received [amount] x [result] for [amount] gold
const inventoryModel = require('../models/usersInventory');
const usersModel = require('../models/users');
const fs = require('fs');
const areasHelper = require('../helpers/areas');

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

        if (!args[0])
            embed.description = `What do you want me to tan for you?\n\nExample: \`${data.prefix}tan 2 leather\``;

        return msg.channel.send({ embed, files });
    },
};
