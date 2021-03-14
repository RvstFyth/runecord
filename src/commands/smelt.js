const usersLocksModel = require('../models/usersLocks');
const inventoryModel = require('../models/usersInventory');
const questsHelper = require('../helpers/quests');
const areaHelper = require('../helpers/areas');
const emojisHelper = require('../helpers/emojis');
const valuesHelper = require('../helpers/values');

const itemMapping = {
    bronze: {
        id: 36,
        xp: 6.2,
        ticks: 6,
        level: 1,
        items: {
            3: 1,
            4: 1,
        },
    },
    iron: {
        id: 87,
        xp: 12.5,
        ticks: 4,
        level: 15,
        items: {
            10: 1,
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
        if (data.char.skills.mining.level < item.level)
            return msg.channel.send(
                `**${data.user.name}** you need level ${item.level} smithing for this..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        const freeSlots = 28 - occupiedSlots;
        if (freeSlots < 1)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

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
        if (amount > freeSlots) amount = freeSlots;

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

        const seconds = item.ticks * 0.6;
        const em = await emojisHelper.get(msg.client, 'smithing');
        const embed = {
            description: `**${data.user.name}** started to smelt ${amount} x ${args[0]}`,
        };
        await usersLocksModel.create(
            data.user.id,
            `**${data.user.name}** please wait on your previous command..`,
            valuesHelper.currentTimestamp() + seconds
        );

        msg.channel
            .send({ embed })
            .then(async (message) => {
                setTimeout(async () => {
                    embed.description = `**${data.user.name}** smelted ${amount} x ${args[0]} ${em} +${xpGain}`;
                    await message.edit({ embed });
                }, seconds * 1000);
            })
            .catch((e) => console.log(e));
    },
};
