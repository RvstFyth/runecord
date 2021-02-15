const usersModel = require('../models/users');
const skillsModel = require('../models/usersSkills');

module.exports = {
    async run(msg, args, data) {
        if (data.user)
            return msg.channel.send(
                `**${data.user.name}** is already registered...`
            );
        if (!args[0])
            return msg.channel.send(
                `**${msg.author.username}** please specify a character name: \`${data.prefix}start [name]\``
            );

        const charName = args[0];

        const userID = await usersModel.create(msg.author.id, charName);

        const skills = [
            'attack',
            'strength',
            'defence',
            'ranged',
            'prayer',
            'magic',
            'runecraft',
            'hitpoints',
            'crafting',
            'mining',
            'smithing',
            'fishing',
            'cooking',
            'firemaking',
            'woodcutting',
            'agility',
            'herblore',
            'thieving',
            'fletching',
            'slayer',
            'farming',
            'construction',
            'hunter',
        ];

        for (let s of skills) {
            await skillsModel.create(userID, s);
        }

        const skillRecord = await skillsModel.getFor(userID, 'hitpoints');
        await skillsModel.addXp(skillRecord.id, 1154);

        return msg.channel.send(
            `**${msg.author.username}** successfully registered as ${charName}! See \`${data.prefix}loc\` to get started and \`${data.prefix}help\` for the help files.`
        );
    },
};
