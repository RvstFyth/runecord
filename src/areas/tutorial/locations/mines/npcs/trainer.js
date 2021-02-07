const userQuestsModel = require('../../../../../models/usersQuests');

module.exports = {
    label: 'mining trainer',
    description: '',

    async talk(data) {
        const firstQuest = await userQuestsModel.getFor(data.userID, 6);
        if (!firstQuest) {
            await userQuestsModel.create(data.userID, 6);
            return `Mining trainer should introduce theirself. New quest: mine copper and tin ore and smelt a bronze bar`;
        } else if (firstQuest && !firstQuest.completed)
            return `Did you get a bronze bar already?`;

        const secondQuest = await userQuestsModel.getFor(data.userID, 7);
        if (!secondQuest) {
            await userQuestsModel.create(data.userID, 7);
            return `Intro about how to use smith command. New Quest: smith a bronze dagger`;
        } else if (secondQuest && !secondQuest.completed)
            return `You will need that bronze dagger before you continue..`;
        else return `The combat instructor is waiting on you. You should hurry up!`;
    },
};
