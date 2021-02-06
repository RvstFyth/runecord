const bankModel = require('../models/usersBank');
module.exports = {
    async run(msg, args, data) {
        let offset = 0,
            limit = 15;

        const bankRecords = await bankModel.getAllForPaginated(
            data.user.id,
            offset,
            limit
        );

        let description = '';
        for (let i in bankRecords)
            description += `${bankRecords[i].itemName}(${bankRecords[i].amount})\n`;

        const fields = [
            {
                name: '\u200b',
                value:
                    `` +
                    `\`bstore [amount] [item]\` to store items in your bank\n` +
                    `\`bget [amount] [item]\` to withdraw items from your bank \n`,
            },
        ];


        const slotsUsed = await bankModel.getTotalCountFor(data.user.id);
        const maxSlots = data.user.supporter ? 800 : 400;

        const embed = {
            title: `${data.user.name}'s bank`,
            description,
            fields,
            footer: {
                text: `Slots ${slotsUsed}/${maxSlots}`
            }
        };

        return msg.channel.send({ embed });
    },
};
