const areasHelper = require('../helpers/areas');
const valuesHelper = require('../helpers/values');

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
        const embed = {
            title: areaData.locations[data.user.location].label,
            description: valuesHelper.replaceAll(areaData.locations[data.user.location].description, '%prefix%', data.prefix),
            fields
        };

        return msg.channel.send({embed});
    }
};