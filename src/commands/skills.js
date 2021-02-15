const valuesHelper = require('../helpers/values');
const emojisHelper = require('../helpers/emojis');

module.exports = {
    async run(msg, args, data) {
        const fields = [];
        const skills = data.char.skills;

        for (let s in skills) {
            const em = await emojisHelper.get(msg.client, skills[s].name);
            fields.push({
                name: `${em} ${valuesHelper.ucfirst(skills[s].name)} (${
                    skills[s].level
                })`,
                value: `XP: ${skills[s].xp}\nTill next level: ${skills[s].remainder}`,
                inline: true,
            });
        }

        let total = valuesHelper.sumArray(
            Object.values(skills).map((s) => s.level)
        );
        fields.push({
            name: `Total levels: ${total}`,
            value: `\u200b`,
            inline: true,
        });

        return msg.channel.send({
            embed: {
                title: `${data.user.name}'s skills`,
                fields,
            },
        });
    },
};
