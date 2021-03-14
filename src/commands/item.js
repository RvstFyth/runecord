const itemsModel = require('../models/items');
const smithingModel = require('../models/recipesSmithing');
const smith = require('./smith');

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what item are you trying to query?!?`
            );

        const input = args.join(' ');
        const item = await itemsModel.getForName(input);
        if (!item)
            return msg.channel.send(
                `**${data.user.name}** there is no item named ${input}..`
            );

        const description =
            `` +
            `Level: ${item.level}\n` +
            `Slot: ${item.slot ? item.slot : '..'}\n` +
            ``;
        const fields = [];

        if (item.meta) {
            const parsed = JSON.parse(item.meta);
            if (parsed.stats) {
                for (let i in parsed.stats) {
                    if (
                        1 === 1 ||
                        (typeof parsed[i] === 'object' && parsed[i] !== null)
                    ) {
                        const tmpField = { name: i, value: '', inline: true };
                        for (let j in parsed.stats[i]) {
                            tmpField.value += `${j}: ${parsed.stats[i][j]}\n`;
                        }
                        fields.push(tmpField);
                    }
                }
            }
            if (parsed.styles) {
                const stylesField = { name: 'Styles', value: '', inline: true };
                for (let i in parsed.styles) {
                    stylesField.value += `${i}\n`;
                }
                fields.push(stylesField);
            }
        }

        const smithingRecipe = await smithingModel.getForItemID(item.id);
        if (smithingRecipe) {
            const smithingField = {
                name: `Smithing (${smithingRecipe.level})`,
                value: '',
            };
            const recipe = smithingRecipe.items.split(';');
            for (let i in recipe) {
                const splitted = recipe[i].split(':');
                const tmpItem = await itemsModel.get(splitted[0]);
                smithingField.value += `${splitted[1]} x ${tmpItem.name}\n`;
            }
            fields.push(smithingField);
        }

        const embed = {
            title: `${item.name}`,
            description,
            fields,
        };

        return msg.channel.send({ embed });
    },
};
