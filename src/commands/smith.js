const usersLocksModel = require('../models/usersLocks');
const recipesModel = require('../models/recipesSmithing');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const areaHelper = require('../helpers/areas');
const questsHelper = require('../helpers/quests');
const emojisHelper = require('../helpers/emojis');
const valuesHelper = require('../helpers/values');

module.exports = {
    async run(msg, args, data) {
        const locationData = areaHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (!locationData.tools || locationData.tools.indexOf('furnace') < 0)
            return msg.channel.send(
                `**${data.user.name}** you need to be at a anvil for this command..`
            );

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to smith?!?`
            );

        let amount = 1;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }

        const input = args.join(' ');
        const item = await itemsModel.getForName(input);
        if (!item)
            return msg.channel.send(
                `**${data.user.name}** there is no item named ${input}..`
            );

        const recipe = await recipesModel.getForItemID(item.id);
        if (!recipe)
            return msg.channel.send(
                `**${data.user.name}** you can't smith ${input}..`
            );

        if (data.char.skills.smithing.level < recipe.level)
            return msg.channel.send(
                `**${data.user.name}** you need smithing level ${recipe.level} for this..`
            );

        const itemsNeeded = {};
        const itemsParsed = recipe.items.split(';');
        for (let i of itemsParsed) {
            const tmp = i.split(':');
            itemsNeeded[tmp[0]] = parseInt(tmp[1]);
        }

        const counts = [];
        for (let i in itemsNeeded) {
            const userItems = await inventoryModel.getTotalAmountFor(
                data.user.id,
                i
            );
            counts.push(Math.floor(userItems / parseInt(itemsNeeded[i])));
        }

        const maxPossible = Math.min(...counts);
        if (!maxPossible)
            return msg.channel.send(
                `**${data.user.name}** you don't have the materials required..`
            );
        if (amount > maxPossible) amount = maxPossible;

        for (let i in itemsNeeded) {
            let amountToDeplete = itemsNeeded[i] * amount;
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

        await inventoryModel.add(data.user.id, recipe.item_id, amount);

        const xpGain = await data.char.skills.smithing.addXp(
            parseInt(recipe.xp) * amount,
            data.user.area === 'tutorial' ? 3 : false
        );

        await questsHelper.check('smith', input, amount, data.user, msg);

        const em = await emojisHelper.get(msg.client, 'smithing');
        const embed = {
            description: `**${data.user.name}** started to smith ${amount} x ${input}`,
        };

        const seconds = parseInt(recipe.ticks) * 0.6;
        await usersLocksModel.create(
            data.user.id,
            `**${data.user.name}** please wait on your previous command..`,
            valuesHelper.currentTimestamp() + seconds
        );

        return msg.channel.send({ embed }).then(async (message) => {
            embed.description = `**${data.user.name}** smithed ${amount} x ${input} ${em} +${xpGain}`;
            setTimeout(async () => {
                await message.edit({ embed });
            }, seconds * 1000);
        });
    },
};
