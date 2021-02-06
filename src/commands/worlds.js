const worldsHelper = require('../helpers/worlds');

module.exports = {
    async run(msg, args, data) {
        const worlds = worldsHelper.getWorlds();
        const fields = [];

        let description = '';
        for (let i in worlds) {
            description += `${worlds[i].id} | ${worlds[i].name} | ${
                Object.values(worlds[i].players).length
            } players. ${worlds[i].premium ? '(Premium)' : ''}\n`;
        }

        const embed = {
            title: `Runecord Worlds`,
            description,
            fields: [
                {
                    name: '\u200b',
                    value:
                        `` +
                        `\`~eworld [id]\` to switch to a other world.\n` +
                        `Premium worlds can only be entered by players with the supporter role on the [support server](https://google.nl)`,
                },
            ],
        };

        return msg.channel.send({ embed });
    },
};
