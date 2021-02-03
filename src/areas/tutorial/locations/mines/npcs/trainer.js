const userQuestsModel = require('../../../../../models/usersQuests');

module.exports = {


    label: 'mining trainer',
    description: '',

    async talk(data) {
        
        const firstQuest = await userQuestsModel.getFor(data.userID, 6);
        if(!firstQuest) {
            await userQuestsModel.create(data.userID, 6);
            return `Mining trainer should introduce theirself. New quest: mine copper ore`;
        }
    }
};
