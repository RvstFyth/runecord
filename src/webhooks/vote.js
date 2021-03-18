const usersModel = require('../models/users');
const characterHelper = require('../helpers/character');
const bankModel = require('../models/usersBank');
// const Discord = require('discord.js');

module.exports = {
    async run(bot, userID, weekend) {
        const user = await usersModel.getForDiscordID(userID);
        if (user) {
            const char = await characterHelper.composeFromUserRecord(user);
            if (char) {
                // lamp id = 99
                await bankModel.add(user.id, 99, 1);

                const user = await bot.users.fetch(userID);
                if (user) {
                    await user.send(
                        `Thank you for voting! You received a XP lamp as reward. You can use it with the \`lamp [skill]\` reward to receive XP in a skill of choice! You can find the XP lamp in your bank account!`
                    );
                }
            }
        }
    },
};
