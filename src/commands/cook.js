const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');
const random = require('../helpers/random');

const itemsMapping = {
    shrimps: { level: 1, resultId: 34, burntId: 35, xp: 30, burnTill: 33, ingredients: {33: 1} },
    test: { level: 999, resultId: 34, burntId: 35, xp: 30, burnTill: 33, ingredients: {33: 1} },
};

module.exports = {

    async run(msg, args, data)
    {
        let amount = 1;
        if(!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }

        if(!args[0]) return msg.channel.send(`**${data.user.name}** what are you trying to cook?!?`);
        if(!itemsMapping[args[0]]) return msg.channel.send(`**${data.user.name}** you can't cook ${args[0]}..`);

        const requestedItem = itemsMapping[args[0]];

        const skillRecord = await skillsModel.getFor(data.user.id, 'cooking');
        const skillLevel = skillsHelper.levelForXp(skillRecord.xp);
        if(skillLevel < requestedItem.level) return msg.channel.send(`**${data.user.name}** you need cooking level ${requestedItem.level} to cook ${args[0]}..`);

        const maxPerItem = [];
        for(let i in requestedItem.ingredients) {
            const userAmount = await inventoryModel.getTotalAmountFor(data.user.id, i);
            if(userAmount > 0) maxPerItem.push(Math.floor(parseInt(userAmount) / requestedItem.ingredients[i]));
            else maxPerItem.push(0);
        }
        const maxAmountPossible = Math.min(...maxPerItem);
        if(!maxAmountPossible) return msg.channel.send(`**${data.user.name}** you don't have the required items to cook ${args[0]}`);

        if(amount > maxAmountPossible) amount = maxAmountPossible;

        const result = {};
        let successCount = 0;
        for(let i = 0; i < amount; i++) {
            let tmpItem;
            if(skillLevel < requestedItem.burnTill && random.number(1, 100) > 90) {
                tmpItem = await itemsModel.get(requestedItem.burntId);
            }
            else {
                tmpItem = await itemsModel.get(requestedItem.resultId);
                successCount++;
                await questsHelper.check('cook', args[0], 1, data.user, msg);
            }

            await inventoryModel.add(data.user.id, tmpItem.id, 1);

            if(!result[tmpItem.id]) {
                result[tmpItem.id] = { name: tmpItem.name, amount: 1 };
            }
            else result[tmpItem.id].amount += 1;
        }

        // deplete items from inv
        for(let i in requestedItem.ingredients) {
            let amountToDeplete = requestedItem.ingredients[i] * amount;
            const userItems = await inventoryModel.getFor(data.user.id, i, '');
            // return console.log(userItems)
            for(let i in userItems) {
                const rAmount = parseInt(userItems[i].amount);
                if(rAmount > amount) await inventoryModel.setAmount(userItems[i].id, rAmount - amount);
                else await inventoryModel.delete(userItems[i].id);
                amountToDeplete -= rAmount;
                if(amountToDeplete < 1) break;
            }
        }

        const fields = Object.values(result).map(r => { return {name: '\u200b', value: `${r.amount} x ${r.name}`, inline: true} });

        const xpGain = data.user.area === 'tutorial' && skillsHelper.levelForXp(skillRecord.xp) > 2 ? 0 : requestedItem.xp * successCount;
        let description;
        if(xpGain > 0) {
            fields.push({name: `\u200b`, value: `+${xpGain}xp`, inline: false});
            await skillsModel.addXp(skillRecord.id, xpGain);
        }


        const embed = {
            title: `${data.user.name}'s cook result`,
            fields,
            description
        };

        return msg.channel.send({embed});
    }
};