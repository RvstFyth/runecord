const valuesHelper = require('../helpers/values');

module.exports = {
    async run(msg, args, data) {
        const fields = [];
        const skills = data.char.skills;

        for (let s in skills) {
            fields.push({
                name: `${valuesHelper.ucfirst(skills[s].name)} (${
                    skills[s].level
                })`,
                value: `XP: ${skills[s].xp}\nTill next level: ${skills[s].remainder}`,
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
