const areasHelper = require('../helpers/areas');
const itemsModel = require('../models/items');
const emojiHelper = require('../helpers/emojis');

module.exports = {
    async run(msg, args, data) {
        let npc, npcIndex;
        if (!isNaN(args[0])) {
            const npcs = Object.values(
                areasHelper.getLocation(data.user.area, data.user.location).npcs
            );
            if (npcs && npcs[args[0] - 1]) {
                npc = npcs[args[0] - 1];
                npcIndex = args[0];
                args = args.splice(1);
            }
            if (!npc)
                return msg.channel.send(
                    `**${data.user.name}** NPC not found..`
                );
            if (!npc.shop)
                return msg.channel.send(
                    `**${data.user.name}** this NPC has no shop..`
                );

            let description = '';
            const em = await emojiHelper.get(msg.client, 'gold');
            for (let i = 0, iEnd = npc.shop.length; i < iEnd; i++) {
                const item = await itemsModel.get(npc.shop[i].id);
                description += `${i + 1}. **${item.name}** ${em} ${
                    npc.shop[i].price
                }\n`;
            }

            const fields = [
                {
                    name: '\u200b',
                    value: `\`${data.prefix}buy ${npcIndex} <amount> [no]\` to buy a item. Replace [no] with the number in front of the item you want to buy. Amount is optional`,
                },
            ];

            const embed = {
                title: npc.label,
                description,
                fields,
            };
            const files = [];
            if (npc.chatHead) {
                files.push({
                    attachment: `./assets/images/npcs/${npc.chatHead}`,
                    name: npc.chatHead,
                });
                embed.thumbnail = {
                    url: `attachment://${npc.chatHead}`,
                };
            }

            return msg.channel.send({ embed, files });
        } else
            return msg.channel.send(
                `**${data.user.name}** invalid arguments provided...`
            );
    },
};
