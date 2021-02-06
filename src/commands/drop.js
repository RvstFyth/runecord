const itemsModel = require('../models/items');
const inventoryModel = require('../models/usersInventory');
const valuesHelper = require('../helpers/values');
const worldsHelper = require('../helpers/worlds');

module.exports = {

    async run(msg, args, data)
    {
        if(!args[0]) return msg.channel.send(`**${user.data.name}** what are you trying to drop?!?`);

        let amount;
        if(!isNaN(args[0])) {
            amount = parseInt(args[0]);
            if(!amount) return msg.channel.send(`**${data.user.name}** invalid amount provided..`);
            args = args.splice(1);
        }
        else amount = 1;

        const itemName = args.join(' ').toLowerCase();
        if(!itemName) return msg.channel.send(`**${user.data.name}** what are you trying to drop?!?`);

        const item = await itemsModel.getForName(itemName);
        if(!item) return msg.channel.send(`**${data.user.name}** there is no item named ${itemName}..`);

        const userItems = await inventoryModel.getFor(data.user.id, item.id, '');
        const totalUserHas = valuesHelper.sumArray(userItems.map(x => x.amount));
        if(totalUserHas === 0) return msg.channel.send(`**${data.user.name}** you don't have any ${itemName}...`);

        if(amount > totalUserHas) amount = totalUserHas;

        let remaining = amount;
        for(let i = 0; i < amount; i++) worldsHelper.addObjectToWorld(data.user.world, item.name, data.user.area, data.user.location);

        for(let i = 0, iEnd = userItems.length; i < iEnd; i++) {
            const rAmount = parseInt(userItems[i].amount);
            if(rAmount > amount) await inventoryModel.setAmount(userItems[i].id, rAmount - amount);
            else await inventoryModel.delete(userItems[i].id);
            remaining -= rAmount;
            if(remaining < 1) break;
        }

        return msg.channel.send(`**${data.user.name}** dropped ${amount} x ${item.name}`);
    }
};
