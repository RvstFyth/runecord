const usersModel = require('../models/users');

module.exports = {
    async run(msg, args, data) {
        const guilds = msg.guild.me.client.guilds.cache.size;
        const users = await usersModel.getTotalRecords();

        const embed = {
            title: 'RuneCord info',
            description: `` + `Servers: ${guilds}\n` + `Users: ${users}`,
        };

        return msg.channel.send({ embed });
    },
};
