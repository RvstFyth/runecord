const areasHelper = require('../helpers/areas');
const valuesHelper = require('../helpers/values');

module.exports = {

    async run(msg, args, data)
    {
        const areaData = await areasHelper.getAreaModules(data.user.area);

        const embed = {
            title: areaData.locations[data.user.location].label,
            description: valuesHelper.replaceAll(areaData.locations[data.user.location].description, '%prefix%', data.prefix)
        };

        return msg.channel.send({embed});
    }
};