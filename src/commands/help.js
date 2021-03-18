const a = (data) => {
    return {
        1: [
            {
                name: 'Basics',
                value:
                    `` +
                    `\`${data.prefix}start [name]\` Creates a account with this bot\n` +
                    `\`${data.prefix}vote\` Vote for RuneCord and get rewarded!\n` +
                    `\`${data.prefix}area\` Displays information about the area you are in\n` +
                    `\`${data.prefix}location\` Displays information about your current location\n` +
                    `\`${data.prefix}areas\` Displays a list of the area's in runecord\n` +
                    `\`${data.prefix}walk [location]\` Walk to a location in the same area you are in\n` +
                    `\`${data.prefix}talk [name]\` Opens a dialog for the NPC\n` +
                    `\`${data.prefix}quests\` See a list of your active quests\n`,
            },
            {
                name: `Character`,
                value:
                    `` +
                    `\`${data.prefix}skills\` Displays your characters skills\n` +
                    `\`${data.prefix}skill [name]\`  Displays details about selected skill\n` +
                    `\`${data.prefix}wearing\` Displays what your character has equipped \n` +
                    `\`${data.prefix}equip [item]\` Equips a item\n` +
                    `\`${data.prefix}styles\` Displays the combat styles you can choose from\n`,
            },
        ],
        2: [
            {
                name: 'Resources',
                value:
                    `` +
                    `\`${data.prefix}backpack\` Displays the content of your backpack\n` +
                    `\`${data.prefix}mine [type]\` Mine for resources\n` +
                    `\`${data.prefix}chop [type]\` Chop for wood\n` +
                    `\`${data.prefix}fish [type]\` \n` +
                    `\`${data.prefix}cook [type]\` \n` +
                    `\`${data.prefix}smelt [type]\` \n` +
                    `\`${data.prefix}light [type]\` \n` +
                    `\`${data.prefix}bury\` Bury bones\n` +
                    `\`${data.prefix}recipes\` See which items can be made with skilling commands\n` +
                    `\`${data.prefix}pu [amount] [item]\` Pickup a item from the floor\n` +
                    `\`${data.prefix}lamp [skill]\` Use a XP lamp and get XP in a skill of choice`,
            },
            {
                name: '\u200b',
                value:
                    `` +
                    `\`${data.prefix}drop [amount] [item]\` Discard a item from your backpack\n` +
                    `\`${data.prefix}eat [item]\` Eat a item from your backpack\n` +
                    ``,
            },
        ],
    };
};

module.exports = {
    async run(msg, args, data) {
        const helpFields = a(data);
        let page = !isNaN(args[0]) ? args[0] : 1;
        if (!helpFields[page]) page = 1;
        const fields = [
            {
                name: '\u200b',
                value: `This bot is still in development and receives a lot of updates. You can join our [Support server](https://discord.gg/UNJKYz244a) to follow news about updates or if you have any queries!`,
            },
            ...helpFields[page],
        ];

        fields.push({
            name: '\u200b',
            value:
                `` +
                `\`${data.prefix}help 1\` Basic commands\n` +
                `\`${data.prefix}help 2\` Resource commands\n\n` +
                `[Support server](https://discord.gg/UNJKYz244a) | [Invite RuneCord](https://discord.com/oauth2/authorize?client_id=810939932817227786&permissions=3532864&scope=bot)`,
        });

        return msg.channel.send({
            embed: {
                fields,
            },
        });
    },
};
