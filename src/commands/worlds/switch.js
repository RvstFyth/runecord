const usersModel = require('../../models/users');
const worldsHelper = require('../../helpers/worlds');

module.exports = {

    subAliasses: ['enter', 's', 'e'],

    aliasses: ['eworld'],

    async run(msg, args, data)
    {
        if(!args[0]) return msg.channel.send(`**${data.user.name}** enter a world id to switch to..`);

        const world = worldsHelper.getWorldForId(parseInt(args[0]));
        if(!world) return msg.channel.send(`**${data.user.name}** world not found...`);

        if(parseInt(data.user.world) === world.id) return msg.channel.send(`**${data.user.name}** you are already on ${world.name}..`);

        if(world.premium && !data.user.supporter) return msg.channel.send(`**${data.user.name}** premium worlds can only be entered by users with the supporter role on our support server..`);

        await usersModel.setWorld(data.user.id, world.id);

        return msg.channel.send(`**${data.user.name}** entered ${world.name}`);
    }
};