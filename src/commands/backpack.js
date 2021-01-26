const inventoryModel = require('../models/usersInventory');

module.exports = {

    aliasses: ['bp'],

    async run(msg, args, data)
    {
        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(data.user.id);
        const userItems = await inventoryModel.getAllFor(data.user.id);

        const fields = [];
        let tmpField = {name: `\u200b`, value: '', inline: true};
        for (let i = 1, iEnd = userItems.length; i <= iEnd; i++) {
            tmpField.value += `${userItems[i - 1].name} ${userItems[i - 1].stacks ? `(${userItems[i - 1].amount})` : ''}\n`;

            if(i % 7 === 0 || i === iEnd) {
                fields.push(tmpField);
                tmpField = {name: `\u200b`, value: '', inline: true};
            }
        }

        fields.push({
            name: '\u200b',
            value: `` +
                `\`${data.prefix}drop [item]\` to drop a item\n` +
                `\`${data.prefix}drop [amount] [item]\` to drop x amount of items`
        });

        const embed = {
            title: `${data.user.name}'s backpack`,
            fields,
            footer: {
                text: `${occupiedSlots}/28`
            }

        };

        return msg.channel.send({embed});
    }
};