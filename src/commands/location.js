const areasHelper = require('../helpers/areas');
const valuesHelper = require('../helpers/values');

module.exports = {

    async run(msg, args, data)
    {
        const areaData = await areasHelper.getAreaModules(data.user.area);
        const npcs = Object.values(areaData.locations[data.user.location].npcs);
        const fields = [];

        if(npcs && npcs.length) {
            const npcField = {name: 'NPCs', value: ''};
            for(let i in npcs) {
                npcField.value += `- ${npcs[i].label}\n`;
            }
            fields.push(npcField);
        }
        const embed = {
            title: areaData.locations[data.user.location].label,
            description: valuesHelper.replaceAll(areaData.locations[data.user.location].description, '%prefix%', data.prefix),
            fields
        };

        return msg.channel.send({embed});
    }
};