const inventoryModel = require('../models/usersInventory');
const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');

module.exports = {

    async run(msg, args, data)
    {
        const locationDetails = areasHelper.getLocation(data.user.area, data.user.location);
        if(!locationDetails.commands || (locationDetails.commands && !locationDetails.commands.mine)) return msg.channel.send(`**${data.user.name}** there nothing to mine here?!?`);

        if(!args[0]) return msg.channel.send(`**${data.user.name}** what are you trying to mine?!?`);
        if(!locationDetails.commands.mine[args[0]]) return msg.channel.send(`**${data.user.name}** you can't mine ${args[0]} here..`);

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(data.user.id);
        if(occupiedSlots >= 28) return msg.channel.send(`**${data.user.name}** your backpack is full..`);

        const skillRecord = await skillsModel.getFor(data.user.id, 'mining');

        const result = locationDetails.commands.mine[args[0]];

        await skillsModel.addXp(skillRecord.id, result.xp);
        await inventoryModel.add(data.user.id, result.id, 1);

        return msg.channel.send(`**${data.user.name}** got 1 ${result.label} and ${result.xp}xp!`);
    }
};