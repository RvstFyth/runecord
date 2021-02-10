const areasHelper = require('../helpers/areas');
const combatHelper = require('../helpers/combat');
const characterHelper = require('../helpers/character');

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** please specify a mob to attack..`
            );

        const input = args.join(' ');
        const locationData = await areasHelper.getLocation(
            data.user.area,
            data.user.location
        );

        if (!locationData.mobs[input])
            return msg.channel.send(
                `**${data.user.name}** there is no ${input} at this location..`
            );
    },
};
