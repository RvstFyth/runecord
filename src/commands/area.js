const areasHelper = require('../helpers/areas');

module.exports = {
    async run(msg, args, data) {
        const areaDetails = await areasHelper.getAreaModules(data.user.area);

        const locationsField = {
            name: 'Locations:',
            value: '',
        };

        let counter = 1;
        for (let i in areaDetails.locations) {
            locationsField.value += `${counter}. ${areaDetails.locations[i].label}\n`;
            counter++;
        }

        const explanationField = {
            name: '\u200b',
            value: `\`${data.prefix}walk [location-name]\` to walk to a other location\n`,
        };

        const embed = {
            title: areaDetails.area.label,
            fields: [locationsField, explanationField],
        };

        return msg.channel.send({ embed });
    },
};
