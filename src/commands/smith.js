const recipesModel = require('../models/recipesSmithing');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');

const questsHelper = require('../helpers/quests');

module.exports = {
    async run(msg, args, data) {
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

        const skillRecord = await skillsModel.getFor(data.user.id, 'smithing');

        let xpGain = parseInt(recipe.xp) * amount;
        if (
            data.user.max_area === 'tutorial' &&
            parseInt(skillRecord.xp) + xpGain > skillsHelper.xpForLevel(3)
        ) {
            let diff = skillsHelper.xpForLevel(3) - parseInt(skillRecord.xp);
            if (diff < 0) diff = 0;
            xpGain = diff;
        }
        if (xpGain > 0) await skillsModel.addXp(skillRecord.id, xpGain);

        await questsHelper.check('smith', input, amount, data.user, msg);

        return msg.channel.send(
            `**${data.user.name}** smithed ${amount} x ${input}` +
                `${xpGain > 0 ? ` and got ${xpGain} xp!` : ''}`
        );
    },
};