const recipesModel = require('../models/recipesCrafting');
const itemsModel = require('../models/items');
const inventoryModel = require('../models/usersInventory');
const emojiHelper = require('../helpers/emojis');
const usersLocksModel = require('../models/usersLocks');
const valuesHelper = require('../helpers/values');
const areaHelper = require('../helpers/areas');

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to craft?!?`
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
                `**${data.user.name}** there is no item named ${input}`
            );
        const recipe = await recipesModel.getForItemID(item.id);
        if (!recipe)
            return msg.channel.send(
                `**${data.user.name}** you can't craft ${input}...`
            );

        if (recipe.tool) {
            const locationData = areaHelper.getLocation(
                data.user.area,
                data.user.location
            );
            if (
                !locationData.tools ||
                locationData.tools.indexOf(recipe.tool) < 0
            )
                return msg.channel.send(
                    `**${data.user.name}** you need to be at a furnace for this command..`
                );
        }

        if (data.char.skills.crafting.level < recipe.level)
            return msg.channel.send(
                `**${data.user.name}** you need crafting level ${recipe.level} for this..`
            );

        const counts = [];
        for (let i in recipe.items) {
            const userItems = await inventoryModel.getTotalAmountFor(
                data.user.id,
                i,
                ''
            );
            counts.push(Math.floor(userItems / parseInt(recipe.items[i])));
        }
        const maxPossible = Math.min(...counts);
        if (!maxPossible) {
            let itemsRequired = [];
            for (let i in recipe.items) {
                const tmpItem = await itemsModel.get(i);
                itemsRequired.push(`- ${recipe.items[i]} x ${tmpItem.name}`);
            }
            return msg.channel.send(
                `**${data.user.name}** you don't have the materials required: \n${itemsRequired.join(`\n`)}`
            );
        }
        if (amount > maxPossible) amount = maxPossible;

        let hasItemsRequired = true;
        let itemsRequired = [];
        for (let i in recipe.requires) {
            const item = await itemsModel.get(i);
            itemsRequired.push(item);
            const userItems = await inventoryModel.getTotalAmountFor(
                data.user.id,
                i
            );
            if (
                hasItemsRequired &&
                (!userItems || userItems < recipe.requires[i])
            ) {
                hasItemsRequired = false;
            }
        }
        if (!hasItemsRequired) {
            const embed = {
                title: `${data.user.name} craft`,
                description: `You need the following items in your inventory for this:\n${itemsRequired
                    .map((i) => i.name)
                    .join('\n-')}`,
            };
            return msg.channel.send({ embed });
        } else {
            const itemsNeeded = recipe.items;
            for (let i in itemsNeeded) {
                let amountToDeplete = itemsNeeded[i] * amount;
                const userItems = await inventoryModel.getFor(
                    data.user.id,
                    i,
                    ''
                );
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
            const xpGain = await data.char.skills.crafting.addXp(
                parseInt(recipe.xp) * amount,
                data.user.area === 'tutorial' ? 3 : false
            );
            const em = await emojiHelper.get(msg.client, 'crafting');
            const embed = {
                title: `${data.user.name} craft result`,
                description: `**${data.user.name}** started to craft ${amount} x ${input}`,
            };

            const seconds = parseInt(recipe.ticks) * 0.6;
            await usersLocksModel.create(
                data.user.id,
                `**${data.user.name}** please wait on your previous command..`,
                valuesHelper.currentTimestamp() + seconds
            );

            return msg.channel.send({ embed }).then(async (message) => {
                embed.description = `**${data.user.name}** crafted ${amount} x ${input} ${em} +${xpGain}`;
                setTimeout(async () => {
                    await message.edit({ embed });
                }, seconds * 1000);
            });
        }
    },
};
