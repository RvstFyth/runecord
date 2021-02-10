const itemsModel = require('../../models/items');
const bankModel = require('../../models/usersBank');
const usersModel = require('../../models/users');

const adminIDs = ['618072611099901962', '377092395931795458'];

module.exports = {
    async run(msg, args, data) {
        if (adminIDs.indexOf(msg.author.id) > -1) {
            const mention = msg.mentions.users.first();
            if (!mention) return msg.reply(`Please mention a user..`);
            if (isNaN(args[0])) return msg.reply(`Please specify a amount..`);
            const amount = parseInt(args[0]);
            const input = args.splice(1).join(' ');
            console.log(input);
            const item = await itemsModel.getForName(input);
            if (!item) return msg.reply(`Item not found`);

            const user = await usersModel.getForDiscordID(mention.id);
            if (user) {
                await bankModel.add(user.id, item.id, amount);
                return msg.react(`👍`);
            } else return msg.reply(`User not found..`);
        }
    },
};
