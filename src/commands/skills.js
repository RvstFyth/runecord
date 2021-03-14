const valuesHelper = require('../helpers/values');
const emojisHelper = require('../helpers/emojis');

module.exports = {
    async run(msg, args, data) {
        const fields = [];
        const skills = data.char.skills;
        const compact = args.filter((a) => a === '-c').length > 0;
        let compactField = { name: `\u200b`, value: '', inline: true };
        let compactCounter = 0;
        for (let s in skills) {
            const em = await emojisHelper.get(msg.client, skills[s].name);
            if (compact) {
                compactField.value += `${em} ${skills[s].level} | TNL: ${skills[s].remainder}\n`;
                compactCounter++;

                if (
                    compactCounter % 7 === 0 ||
                    compactCounter === Object.keys(skills).lengt - 1
                ) {
                    fields.push(compactField);
                    compactField = { ...compactField };
                    compactField.value = '';
                }
            } else {
                fields.push({
                    name: `${em} ${valuesHelper.ucfirst(skills[s].name)} (${
                        skills[s].level
                    })`,
                    value: `XP: ${skills[s].xp}\nTill next level: ${skills[s].remainder}`,
                    inline: true,
                });
            }
        }

        if (compact) fields.push(compactField);

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
