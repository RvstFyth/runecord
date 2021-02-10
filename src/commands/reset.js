const usersModel = require('../models/users');

module.exports = {
    async run(msg, args, data) {
        await usersModel.delete(data.user.id);
        return msg.reply(`Account deleted!`);
    },
};
