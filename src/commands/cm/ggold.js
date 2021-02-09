const usersModel = require('../../models/users');

const adminIDs = ['618072611099901962', '377092395931795458'];

module.exports = {
    async run(msg, args, data) {
        if (adminIDs.indexOf(msg.author.id) > -1) {
            const mention = msg.mentions.users.first();
            if (isNaN(args[0])) return msg.reply(`Please specify a amount..`);
            const amount = parseInt(args[0]);
            if (mention) {
                const user = await usersModel.getForDiscordID(mention.id);
                if (user) {
                    await usersModel.addGold(user.id, amount);
                    return msg.react(`👍`);
                } else return msg.reply(`User not found..`);
            }
        }
    },
};
