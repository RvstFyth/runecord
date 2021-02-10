const inventoryModel = require('../models/usersInventory');
const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');

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

        const skillRecord = await skillsModel.getFor(data.user.id, 'smithing');
        let xpGain = item.xp * amount;
        if (
            data.user.area === 'tutorial' &&
            parseInt(skillRecord.xp) + xpGain > skillsHelper.xpForLevel(3)
        ) {
            let diff = skillsHelper.xpForLevel(3) - parseInt(skillRecord.xp);
            if (diff < 0) diff = 0;
            xpGain = diff;
        }
        if (xpGain > 0) {
            await skillsModel.addXp(skillRecord.id, xpGain);
        }

        await questsHelper.check('smelt', args[0], 1, data.user, msg);
        return msg.channel.send(
            `**${data.user.name}** smelted ${amount} x ${args[0]} ${
                xpGain > 0 ? ` and got ${xpGain} xp` : ''
            }`
        );
    },
};
