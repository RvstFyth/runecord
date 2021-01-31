const areasHelper = require('../helpers/areas');
const valuesHelper = require('../helpers/values');
const worldsHelper = require('../helpers/worlds');

module.exports = {

    aliasses: ['loc'],

    async run(msg, args, data)
    {
        const areaData = await areasHelper.getAreaModules(data.user.area);
        const npcs = Object.values(areaData.locations[data.user.location].npcs);
        const fields = [];

        if(npcs && npcs.length) {
            const npcField = {name: 'NPCs', value: '', inline: true};
            for(let i in npcs) {
                npcField.value += `- ${npcs[i].label}\n`;
            }
            fields.push(npcField);
        }

        if(areaData.locations[data.user.location].commands && Object.values(areaData.locations[data.user.location].commands).length) {
            const resourcesField = {name: 'Resources', value: '', inline: true};
            const commands = areaData.locations[data.user.location].commands;
            for(let i in commands) {
                for(let j in commands[i]) {
                    resourcesField.value += `${valuesHelper.ucfirst(j)}\n`;
                }
            }
            fields.push(resourcesField);
        }

        const players = worldsHelper.getPlayersOnLocation(data.user.world, data.user.area, data.user.location);
        console.log(players)
        if(players && players.length) {
            const playersFields = {name: `Players`, value: ``, inline: true};
            for(let i of players) playersFields.value += `${i}\n`;
            fields.push(playersFields);
        }

        const embed = {
            title: areaData.locations[data.user.location].label,
            description: valuesHelper.replaceAll(areaData.locations[data.user.location].description, '%prefix%', data.prefix),
            fields
        };

        return msg.channel.send({embed});
    }
};