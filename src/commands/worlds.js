const worldsHelper = require('../helpers/worlds');

module.exports = {

    async run(msg, args, data)
    {

        const worlds = worldsHelper.getWorlds();
        const fields = [];

        for(let i in worlds) {
            fields.push({
                name: `${worlds[i].id} | ${worlds[i].name}`,
                value: `` +
                    `Players: ${Object.values(worlds[i].players).length}\n` +
                    `Premium: ${worlds[i].premium ? 'yes' : 'no'}`,
                inline: true
            });
        }

        const embed = {
            title: `Runecord Worlds`,
            fields,
            description: `` +
                `\`~worlds switch [id]\` to switch to a other world.\n` +
                `Premium worlds can only be entered by players with the supporter role on the [support server](https://google.nl)`
        };

        return msg.channel.send({embed});
    }
};