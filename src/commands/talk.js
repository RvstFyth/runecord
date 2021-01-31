const areasHelper = require('../helpers/areas');

module.exports = {

    async run(msg, args, data)
    {
        if(!args[0]) return msg.channel.send(`**${data.user.name}** who do you want to talk too? Select a NPC with \`${data.prefix}talk [npc-name]\``);

        const argument = args.join(' ').toLowerCase();
        const npc = areasHelper.getNpcForLabel(data.user.area, data.user.location, argument);
        if(!npc) return msg.channel.send(`**${data.user.name} there is no NPC named ${argument} on this location..`);

        const embed = {
            title: npc.label,
            description: await npc.talk({userID: data.user.id, msg: msg, user: data.user})
        };

        return msg.channel.send({embed});
    },
};