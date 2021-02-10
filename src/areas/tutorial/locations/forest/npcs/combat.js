const questsModel = require('../../../../../models/usersQuests');

module.exports = {
    label: 'combat instructor',

    async talk(data) {
        const firstQuest = await questsModel.getFor(data.userID, 9);
        if (!firstQuest) {
            await questsModel.create(data.userID, 9);
            return `Small explanation about combat\n.....\n\nNew quest: Kill a rat. \nMake sure you wield your dagger before you start!`;
        }
        if (firstQuest && !firstQuest.completed)
            return `What are you waiting for? Just kill a rat already..`;

        return `The financial adviser is waiting for you, you can find him at the bank`;
    },
};
