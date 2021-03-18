const bankModel = require('../models/usersBank');
const areaHelper = require('../helpers/areas');

module.exports = {
    async run(msg, args, data) {
        const locationData = areaHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (!locationData.tools || locationData.tools.indexOf('bank') < 0)
            return msg.channel.send(
                `**${data.user.name}** you need to be at a bank for this command..`
            );

        let page = 1;
        if (!isNaN(args[0])) page = parseInt(args[0]);

        const slotsUsed = await bankModel.getTotalCountFor(data.user.id);
        const limit = 2;

        const maxPage = Math.ceil(slotsUsed / limit);
        if (page > maxPage) page = maxPage;
        let offset = page * limit - limit;
        if (offset < 0) offset = 0;

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
                    `\`bank [pageNo]\` to change page\n` +
                    `\`bstore [amount] [item]\` to store items in your bank\n` +
                    `\`bget [amount] [item]\` to withdraw items from your bank \n`,
            },
        ];

        const maxSlots = data.user.supporter ? 800 : 400;

        const embed = {
            title: `${data.user.name}'s bank`,
            description,
            fields,
            footer: {
                text: `Slots ${slotsUsed}/${maxSlots} | Page ${page}/${maxPage}`,
            },
        };

        return msg.channel.send({ embed });
    },
};
