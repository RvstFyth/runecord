const areasHelper = require('../helpers/areas');
const valuesHelper = require('../helpers/values');
const worldsHelper = require('../helpers/worlds');

module.exports = {
    aliasses: ['loc'],

    async run(msg, args, data) {
        const areaData = await areasHelper.getAreaModules(data.user.area);
        const npcs = Object.values(areaData.locations[data.user.location].npcs);
        const fields = [];

        if (npcs && npcs.length) {
            const npcField = { name: 'NPCs', value: '', inline: true };
            let counter = 1;
            for (let i in npcs) {
                npcField.value += `${counter}. ${npcs[i].label}\n`;
                counter++;
            }
            fields.push(npcField);
        }

        if (
            areaData.locations[data.user.location].commands &&
            Object.values(areaData.locations[data.user.location].commands)
                .length
        ) {
            const resourcesField = {
                name: 'Resources',
                value: '',
                inline: true,
            };
            const commands = areaData.locations[data.user.location].commands;
            for (let i in commands) {
                for (let j in commands[i]) {
                    resourcesField.value += `${valuesHelper.ucfirst(j)}\n`;
                }
            }
            fields.push(resourcesField);
        }

        if (
            areaData.locations[data.user.location].tools &&
            Object.values(areaData.locations[data.user.location].tools).length
        ) {
            const toolsField = {
                name: 'Tools',
                value: '',
                inline: true,
            };

            const tools = areaData.locations[data.user.location].tools;
            for (let i of tools) {
                toolsField.value += `${valuesHelper.ucfirst(i)}\n`;
            }
            fields.push(toolsField);
        }

        if (
            areaData.locations[data.user.location].mobs &&
            Object.values(areaData.locations[data.user.location].mobs).length
        ) {
            const mobsField = {
                name: 'Mobs',
                value: '',
                inline: true,
            };

            const mobs = areaData.locations[data.user.location].mobs;
            for (let i in mobs) {
                mobsField.value += `${valuesHelper.ucfirst(i)}\n`;
            }
            fields.push(mobsField);
        }

        const players = worldsHelper.getPlayersOnLocation(
            data.user.world,
            data.user.area,
            data.user.location
        );

        if (players && players.length) {
            const playersFields = { name: `Players`, value: ``, inline: true };
            for (let i of players) playersFields.value += `${i}\n`;
            fields.push(playersFields);
        }

        const objects = worldsHelper.getObjectsOnLocation(
            data.user.world,
            data.user.area,
            data.user.location
        );
        if (objects && objects.length) {
            const arr = objects.map((o) => o.name);
            const res = {};
            for (let i in arr) {
                if (!res[arr[i]]) res[arr[i]] = 1;
                else res[arr[i]]++;
            }
            const objectsField = { name: 'Objects', value: ``, inline: true };
            for (let i in res)
                objectsField.value += `${i} ${
                    res[i] > 1 ? `(${res[i]})` : ''
                }\n`;
            fields.push(objectsField);
        }

        const embed = {
            title: areaData.locations[data.user.location].label,
            description: valuesHelper.replaceAll(
                areaData.locations[data.user.location].description,
                '%prefix%',
                data.prefix
            ),
            fields,
        };

        return msg.channel.send({ embed });
    },
};
