const usersModel = require('../models/users');
const characterHelper = require('../helpers/character');
const bankModel = require('../models/usersBank');

module.exports = {
    async run(bot, userID, weekend) {
        const user = await usersModel.getForDiscordID(userID);
        if (user) {
            const char = await characterHelper.composeFromUserRecord(user);
            if (char) {
                // lamp id = 99
                await bankModel.add(char.id, 99, 1);

                const discUser = await bot.users.fetch(userID);
                if (discUser) {
                    await discUser.send(
                        `Thank you for voting! You received a XP lamp as reward. You can use it with the \`lamp [skill]\` reward to receive XP in a skill of choice! You can find the XP lamp in your bank account!`
                    );
                }
            }
        }
    },
};
