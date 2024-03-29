const areasHelper = require('../helpers/areas');
const fs = require('fs');

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** who do you want to talk too? Select a NPC with \`${data.prefix}talk [npc-name]\``
            );

        let npc;
        if (!isNaN(args[0])) {
            const npcs = Object.values(
                areasHelper.getLocation(data.user.area, data.user.location).npcs
            );
            if (npcs && npcs[args[0] - 1]) {
                npc = npcs[args[0] - 1];
                args = args.splice(1);
            }
        } else {
            const argument = args.join(' ').toLowerCase();
            npc = areasHelper.getNpcForLabel(
                data.user.area,
                data.user.location,
                argument
            );
            if (!isNaN(args[args.length - 1])) {
                args = [args[args.length - 1]];
            }
        }
        if (!npc)
            return msg.channel.send(
                `**${data.user.name}** there is no NPC named ${args
                    .join(' ')
                    .toLowerCase()} on this location..`
            );

        const embed = {
            title: npc.label,
            description: await npc.talk({
                userID: data.user.id,
                msg: msg,
                user: data.user,
                prefix: data.prefix,
                args,
            }),
        };

        const files = [];
        if (
            npc.chatHead &&
            fs.existsSync(`./assets/images/npcs/${npc.chatHead}`)
        ) {
            files.push({
                attachment: `./assets/images/npcs/${npc.chatHead}`,
                name: npc.chatHead,
            });
            embed.thumbnail = {
                url: `attachment://${npc.chatHead}`,
            };
        }

        return msg.channel.send({ embed, files });
    },
};
