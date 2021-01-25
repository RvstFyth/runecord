const areasHelper = require('../helpers/areas');

module.exports = {

    async run(msg, args, data)
    {
        const areaDetails = await areasHelper.getAreaModules(data.user.area);

        const locationsField = {
            name: 'Locations:',
            value: ''
        };

        for(let i in areaDetails.locations) {
            locationsField.value += `${areaDetails.locations[i].label}\n`
        }

        const explanationField = {
            name: '\u200b',
            value: `\`${data.prefix}walk [location-name]\` to walk to a other location\n`
        }

        const embed = {
            title: areaDetails.area.label,
            fields: [locationsField, explanationField]
        };

        return msg.channel.send({embed});
    }
};