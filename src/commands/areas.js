const areaHelper = require('../helpers/areas');

module.exports = {
    async run(msg, args, data) {
        const areas = areaHelper.getAreaLabels();

        const fields = [];

        let field = { name: '\u200b', value: '', inline: true };

        for (let i = 0, iEnd = areas.length; i < iEnd; i++) {
            field.value += `${i + 1}. ${areas[i]}\n`;
            if ((i > 0 && i % 7 === 0) || i === iEnd - 1) {
                fields.push(field);
                field = { ...field };
                field.value = '';
            }
        }

        fields.push({
            name: '\u200b',
            value: `\`${data.prefix}travel [number]\` to travel to another area. [number] should be replaced with the number in front of the area name`,
        });
        const embed = {
            fields,
        };
        return msg.channel.send({ embed });
    },
};
