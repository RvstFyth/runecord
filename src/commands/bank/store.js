const bankModel = require('../../models/usersBank');
const inventoryModel = require('../../models/usersInventory');
const itemsModel = require('../../models/items');

module.exports = {
    subAliasses: ['s'],
    aliasses: ['bstore'],
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to store?!?`
            );
        let amount = 1;
        if(!isNaN(args[0])) {
            amount = parseInt(args[0]);
            args = args.splice(1);
        }
        const input = args.join(' ');
        const item = await itemsModel.getForName(input);
        if(!item) return msg.channel.send(`**${data.user.name}** there is no item with the name ${input}..`);
        
        const userAmount = await inventoryModel.getTotalAmountFor(data.user.id, item.id);
        if(!userAmount) return msg.channel.send(`**${data.user.name}** you don't have any ${input}..`);

        if(amount > userAmount) amount = userAmount;

        // 
        const userItems = await inventoryModel.getFor(data.user.id, item.id, '');
        let remaining = amount;
        
        for(let i = 0, iEnd = userItems.length; i < iEnd; i++) {
            const rAmount = parseInt(userItems[i].amount);
            if(rAmount > amount) await inventoryModel.setAmount(userItems[i].id, rAmount - amount);
            else await inventoryModel.delete(userItems[i].id);
            remaining -= rAmount;
            if(remaining < 1) break;
        }

        await bankModel.add(data.user.id, item.id, amount);

        msg.channel.send(`**${data.user.name}** stored ${amount} x ${item.name} in their bank..`);
    },
};
