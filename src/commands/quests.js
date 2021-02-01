const questsModel = require('../models/usersQuests');

module.exports = {

    async run(msg, args, data)
    {
        const quests = await questsModel.getActiveFor(data.user.id);

        const fields = [];
        for(let i in quests) {
            fields.push({
                name: `${quests[i].name} ${quests[i].totalAmount ? `(${quests[i].amount}/${quests[i].totalAmount})` : ''}`,
                value: quests[i].description
            })
        }

        const embed = {
            title: `${data.user.name}'s quests`,
            fields,
            thumbnail: {
                url: `attachment://quest.png`
            }
        };

        return msg.channel.send({
            embed,
            files: [
                {name: 'quest.png', attachment: `./assets/images/quest.png`}
            ]
        });
    }
};