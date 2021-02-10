const usersModel = require('../models/users');

const startLocations = {
    lumbridge: 'castlecourtyard',
};

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** where do you want to travel too?`
            );
        if (args[0] === 'tutorial')
            return msg.channel.send(
                `**${data.user.name}** you can't travel back to tutorial island...`
            );
        args[0] = args.join(' ');
        if (!startLocations[args[0]])
            return msg.channel.send(
                `**${data.user.name}** invalid area name provided. See \`${data.prefix}areas\` command for valid area's`
            );
        if (args[0] === data.user.area)
            return msg.channel.send(
                `**${data.user.name}** you are already in ${args[0]}..`
            );

        await usersModel.setArea(data.user.id, args[0]);
        await usersModel.setLocation(data.user.id, startLocations[args[0]]);

        return msg.channel.send(
            `**${data.user.name}** you are now in ${args[0]}`
        );
    },
};
