module.exports = {

    async run(msg, args, data)
    {

        const fields = [
            {
                name: 'Basics',
                value: `` +
                    `\`${data.prefix}start [name]\` Creates a account with this bot\n` +
                    `\`${data.prefix}location\` Displays information about your current location\n` +
                    `\`${data.prefix}area\` Displays information about the area you are in\n` +
                    `\`${data.prefix}walk [location]\` Walk to a location in the same area you are in\n`
            },
            {
                name: `Character`,
                value: `` +
                    `\`${data.prefix}skills\` Displays your characters skills\n` +
                    `\`${data.prefix}skill [name]\`  Displays details about selected skill\n` +
                    `\`${data.prefix}wearing\` Displays what your character has equipped \n`
            },
            {
                name: 'Resources',
                value: `` +
                    `\`${data.prefix}backpack\` Displays the content of your backpack\n` +
                    `\`${data.prefix}drop [amount] [item]\` Discard a item from your backpack\n` +
                    `\`${data.prefix}mine [type]\` Mine for resources\n` +
                    `\`${data.prefix}chop [type]\` Chop for wood\n` +
                    `\`${data.prefix}fish [type]\` \n` +
                    `\`${data.prefix}cook [type]\` \n` +
                    `\`${data.prefix}smelt [type]\` \n` +
                    `\`${data.prefix}light [type]\` \n`
                    
            },
            {
                name: `NPC's`,
                value: `` +
                    `\`${data.prefix}talk [name]\` Opens a dialog for the NPC`
            }
        ];


        fields.push({
            name: '\u200b',
            value: `[Support server](https://discord.gg/UNJKYz244a)`
        });

        return msg.channel.send({
            embed: {
                fields
            },
        })
    }
};
