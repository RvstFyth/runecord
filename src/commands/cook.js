const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');
const random = require('../helpers/random');

const itemsMapping = {
    shrimps: { level: 1, resultId: 34, burntId: 35, xp: 30, burnTill: 33, ingredients: {33: 1} }
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
        const maxPerItem = [];
        for(let i in requestedItem.ingredients) {
            const userAmount = await inventoryModel.getTotalAmountFor(data.user.id, i);
            if(userAmount > 0) maxPerItem.push(Math.floor(parseInt(userAmount) / requestedItem.ingredients[i]));
            else maxPerItem.push(0);
        }
        const maxAmountPossible = Math.min(...maxPerItem);
        if(!maxAmountPossible) return msg.channel.send(`**${data.user.name}** you don't have the required items to cook ${args[0]}`);

        if(amount > maxAmountPossible) amount = maxAmountPossible;

        return msg.channel.send(`COOK ${amount} x ${args[0]}`);
    }
};