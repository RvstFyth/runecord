const questsModel = require('../models/usersQuests');

module.exports = {

    async run(msg, args, data)
    {
        const quests = await questsModel.getActiveFor(data.user.id);

        const fields = [];
        for(let i in quests) {
            fields.push({
                name: quests[i].name,
                value: quests[i].description
            })
        }

        const embed = {
            title: `${data.user.name}'s quests`,
            fields
        };

        return msg.channel.send({embed});
    }
};