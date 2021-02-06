const skillsModel = require('../models/usersSkills');
const valuesHelper = require('../helpers/values');

const skillsHelper = require('../helpers/skills');

module.exports = {
    async run(msg, args, data) {
        const userSkills = await skillsModel.getAllFor(data.user.id);

        const fields = [];
        for (let i in userSkills) {
            const level = skillsHelper.levelForXp(userSkills[i].xp);
            const totalForNextLevel = skillsHelper.xpForLevel(level + 1);
            const totalXp = parseInt(userSkills[i].xp);
            const remainder = totalForNextLevel - totalXp;

            fields.push({
                name: `${valuesHelper.ucfirst(userSkills[i].skill)} (${level})`,
                value: `XP: ${userSkills[i].xp}\nTill next level: ${remainder}`,
                //value: `Level: ${level}\nXP: ${userSkills[i].xp}\nNext level: ${totalForNextLevel}\nRemainder: ${remainder}`,
                inline: true,
            });
        }

        msg.channel.send({
            embed: {
                title: `${data.user.name}'s skills`,
                fields,
            },
        });
    },
};
