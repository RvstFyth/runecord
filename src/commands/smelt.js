const inventoryModel = require('../models/usersInventory');
const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');
const areaHelper = require('../helpers/areas');
const emojisHelper = require('../helpers/emojis');

const itemMapping = {
    bronze: {
        id: 36,
        xp: 6.2,
        items: {
            3: 1,
            4: 1,
        },
    },
};

module.exports = {
    async run(msg, args, data) {
        const locationData = areaHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (!locationData.tools || locationData.tools.indexOf('furnace') < 0)
            return msg.channel.send(
                `**${data.user.name}** you need to be at a furnace for this command..`
            );
        let amount = 1;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }
        if (amount < 1)
            return msg.channel.send(
                `**${data.user.name}** please specify a amount > 0`
            );

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to smelt?!?`
            );
        if (!itemMapping[args[0]])
            return msg.channel.send(
                `**${data.user.name}** you can't smelt ${args[0]}`
            );

        const item = itemMapping[args[0]];
        const itemsCount = [];
        for (let i in item.items) {
            const itemRecord = await inventoryModel.getTotalAmountFor(
                data.user.id,
                i
            );
            itemsCount.push(
                Math.max(0, Math.floor(itemRecord / item.items[i]))
            );
        }

        const maxPossible = Math.min(...itemsCount);
        if (!maxPossible)
            return msg.channel.send(
                `**${data.user.name}** you don't have the materials required...`
            );

        if (amount > maxPossible) amount = maxPossible;

        for (let i in item.items) {
            let amountToDeplete = item.items[i] * amount;
            const userItems = await inventoryModel.getFor(data.user.id, i, '');
            for (let i in userItems) {
                const rAmount = parseInt(userItems[i].amount);
                if (rAmount > amount)
                    await inventoryModel.setAmount(
                        userItems[i].id,
                        rAmount - amount
                    );
                else await inventoryModel.delete(userItems[i].id);
                amountToDeplete -= rAmount;
                if (amountToDeplete < 1) break;
            }
        }

        await inventoryModel.add(data.user.id, item.id, amount);

        const xpGain = await data.char.skills.smithing.addXp(
            item.xp * amount,
            data.user.area === 'tutorial' ? 3 : false
        );

        await questsHelper.check('smelt', args[0], 1, data.user, msg);

        const em = await emojisHelper.get(msg.client, 'smithing');
        const embed = {
            description: `**${data.user.name}** smelted ${amount} x ${args[0]} ${em} +${xpGain}`,
        };
        return msg.channel.send({ embed });
    },
};
