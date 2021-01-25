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
                    `\`${data.prefix}skill [name]\`  Displays details about selected skill\n`
            },
            {
                name: 'Resources',
                value: `` +
                    `\`${data.prefix}backpack\` Displays the content of your backpack\n` +
                    `\`${data.prefix}drop [amount] [item]\` Discard a item from your backpack\n` +
                    `\`${data.prefix}mine [type]\` Mine for resources\n` +
                    `\`${data.prefix}chop [type]\` Chop for wood\n`
            },
            {
                name: `NPC's`,
                value: `` +
                    `\`${data.prefix}talk [name]\` Opens a dialog for the NPC`
            }
        ];

        return msg.channel.send({
            embed: {
                fields
            }
        })
    }
};