const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');
const random = require('../helpers/random');
const recipesModel = require('../models/recipesCooking');
const emojisHelper = require('../helpers/emojis');

module.exports = {
    async run(msg, args, data) {
        let amount = 1;
        if (!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to cook?!?`
            );

        let item;
        const input = args.join(' ');
        let recipe = await recipesModel.getForAlias(input);
        if (recipe) {
            item = await itemsModel.getForName(recipe.item_id);
        } else {
            item = await itemsModel.getForName(input);
            if (!item)
                return msg.channel.send(
                    `**${data.user.name}** there is no item named ${input}..`
                );

            recipe = await recipesModel.getForItemID(item.id);
        }
        if (!recipe)
            return msg.channel.send(
                `**${data.user.name}** recipe not found for ${input}`
            );

        const skillRecord = await skillsModel.getFor(data.user.id, 'cooking');
        const skillLevel = skillsHelper.levelForXp(skillRecord.xp);
        if (skillLevel < recipe.level)
            return msg.channel.send(
                `**${data.user.name}** you need cooking level ${recipe.level} to cook ${input}..`
            );

        const maxPerItem = [];
        for (let i in recipe.items) {
            const userAmount = await inventoryModel.getTotalAmountFor(
                data.user.id,
                i
            );
            if (userAmount > 0)
                maxPerItem.push(
                    Math.floor(parseInt(userAmount) / recipe.items[i])
                );
            else maxPerItem.push(0);
        }
        const maxAmountPossible = Math.min(...maxPerItem);
        if (!maxAmountPossible)
            return msg.channel.send(
                `**${data.user.name}** you don't have the required items to cook ${args[0]}`
            );

        if (amount > maxAmountPossible) amount = maxAmountPossible;

        const result = {};
        let successCount = 0;
        for (let i = 0; i < amount; i++) {
            let tmpItem;
            if (skillLevel < recipe.burnTill && random.number(1, 100) > 90) {
                tmpItem = await itemsModel.get(recipe.burnt_id);
            } else {
                tmpItem = await itemsModel.get(recipe.item_id);
                successCount++;
                await questsHelper.check('cook', args[0], 1, data.user, msg);
            }

            await inventoryModel.add(data.user.id, tmpItem.id, 1);

            if (!result[tmpItem.id]) {
                result[tmpItem.id] = { name: tmpItem.name, amount: 1 };
            } else result[tmpItem.id].amount += 1;
        }

        // deplete items from inv
        for (let i in recipe.ingredients) {
            let amountToDeplete = recipe.items[i] * amount;
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

        const fields = Object.values(result).map((r) => {
            return {
                name: '\u200b',
                value: `${r.amount} x ${r.name}`,
                inline: true,
            };
        });

        const xpGain = await data.char.skills.cooking.addXp(
            recipe.xp * successCount
        );
        const em = await emojisHelper.get(msg.client, 'cooking');
        fields.push({
            name: '\u200b',
            value: `${em} +${xpGain}`,
        });
        const embed = {
            fields,
        };

        return msg.channel.send({ embed });
    },
};
