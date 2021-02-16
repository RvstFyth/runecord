const usersModel = require('../models/users');
const areasHelper = require('../helpers/areas');

const startLocations = {
    lumbridgecastle: 'courtyard',
    lumbridgenorth: 'sheepmeadow',
    lumbridgewest: 'forest',
    lumbridgesquare: 'generalgoods',
};

module.exports = {
    async run(msg, args, data) {
        const areas = areasHelper.getAreaLabels();
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** where do you want to travel too?`
            );

        const index = parseInt(args[0]);
        if (!index || !areas[index - 1])
            return msg.channel.send(
                `**${data.user.name}** invalid area number provided. See \`${data.prefix}areas\` for valid numbers..`
            );

        const area = areasHelper.getAreaForLabel(Object.values(areas)[index]);
        const startLocation = area.area.startLocation;
        if (!startLocation)
            return msg.channel.send(
                `**${data.user.name}** there is a misconfiguration, please contact a developer..`
            );

        if (area.name === data.user.area)
            return msg.channel.send(
                `**${data.user.name}** you are already in ${area.area.label}..`
            );

        await usersModel.setArea(data.user.id, area.name);
        await usersModel.setLocation(data.user.id, startLocation);

        return msg.channel.send(
            `**${data.user.name}** you are now in ${area.area.label}`
        );
    },
};
