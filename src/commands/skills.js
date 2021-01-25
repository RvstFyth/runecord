const skillsModel = require('../models/usersSkills');
const valuesHelper = require('../helpers/values');

module.exports = {

    async run(msg, args, data)
    {
        const userSkills = await skillsModel.getAllFor(data.user.id);

        const fields = [];
        for(let i in userSkills) {
            fields.push({
                name: valuesHelper.ucfirst(userSkills[i].skill),
                value: `Level: 1\nXP: ${userSkills[i].xp}`,
                inline: true
            });
        }

        msg.channel.send({embed: {
                title: `${data.user.name}'s skills`,
                fields
            }});
    }
};