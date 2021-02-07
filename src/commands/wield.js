const inventoryModel = require('../models/usersInventory');
const equippedModel  = require('../models/usersEquipped');
const itemsModel = require('../models/items');

const validSlots = ['weapon', 'quiver'];

module.exports = {


    async run(msg, args, data)
    {
        if(!args[0]) return msg.channel.send(`**${data.user.name}** what are you trying to wield?!?`);

        const input = args.join(' ');
        const item = await itemsModel.getForName(input);
        if(!item) return msg.channel.send(`**${data.user.name}** there is no item named ${input}..`);
        if(validSlots.indexOf(item.slot) < -1) return msg.channel.send(`*${data.user.name}** you can't wield ${input}..`);


        const userEquipped = await equippedModel.getFor(data.user.id);
        if(userEquipped.weapon && userEquipped.weapon == item.id) return msg.channel.send(`**${data.user.name}** you already wield ${input}..`);

        const userItems = await inventoryModel.getFor(data.user.id, item.id);
        if(!userItems || !userItems.length) return msg.channel.send(`**${data.user.name}** you don't have any ${input}..`);

        if(item.stacks && userItems[0].amount > 1) {
            await inventoryModel.setAmount(userItems[0].id, parseInt(userItems[0].amount) - 1);
        }
        else await inventoryModel.delete(userItems[0].id);

        if(userEquipped.weapon) {
            await inventoryModel.add(data.user.id, userEquipped.weapon, 1);
        }

        await equippedModel.setSlot(data.user.id, item.slot, item.id);

        return msg.channel.send(`**${data.user.name}** started to wield a ${input}`);
    }
};
