const skillsModel = require('../models/usersSkills');
const valuesHelper = require('../helpers/values');

const skillsHelper = require('../helpers/skills');

module.exports = {

    async run(msg, args, data)
    {
        const userSkills = await skillsModel.getAllFor(data.user.id);

        const fields = [];
        for(let i in userSkills) {
            fields.push({
                name: valuesHelper.ucfirst(userSkills[i].skill),
                value: `Level: ${skillsHelper.levelForXp(userSkills[i].xp)}\nXP: ${userSkills[i].xp}`,
                inline: true
            });
        }

        msg.channel.send({embed: {
                title: `${data.user.name}'s skills`,
                fields
            }});
    }
};