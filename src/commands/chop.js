const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');

const lootMapping = {
    tutorial: {
        forest: {
            xp: 25,
            item: 1
        }
    }
};

module.exports = {


    async run(msg, args, data)
    {
        const locationDetails = areasHelper.getLocation(data.user.area, data.user.location);
        if(!locationDetails.commands || (locationDetails.commands && locationDetails.commands.indexOf('chop') < 0)) return msg.channel.send(`**${data.user.name}** there nothing to chop here?!?`);

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(data.user.id);
        if(occupiedSlots >= 28) return msg.channel.send(`**${data.user.name}** your backpack is full..`);

        const skillRecord = await skillsModel.getFor(data.user.id, 'woodcutting');
        const currentXP = parseInt(skillRecord.xp);
        const level = 1;

        const reward = lootMapping[data.user.area][data.user.location];

        await skillsModel.addXp(skillRecord.id, reward.xp);
        await inventoryModel.add(data.user.id, reward.item, 1);

        const item = await itemsModel.get(reward.item);
        return msg.channel.send(`**${data.user.name}** chopped a tree and got a ${item.name} and ${reward.xp}xp!`);
    }
};