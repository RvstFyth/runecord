const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');

module.exports = {
    async run(msg, args, data) {
        const locationDetails = areasHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (
            !locationDetails.commands ||
            (locationDetails.commands && !locationDetails.commands.chop)
        )
            return msg.channel.send(
                `**${data.user.name}** there nothing to chop here?!?`
            );

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to chop?!?`
            );

        if (!locationDetails.commands.chop[args[0]])
            return msg.channel.send(
                `**${data.user.name}** you can't chop ${args[0]} here..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        if (occupiedSlots >= 28)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

        const axe = await inventoryModel.getWithTypeAndHighestLevel(
            data.user.id,
            'axe'
        );
        if (!axe || axe.amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you need to carry a axe for this..`
            );

        const skillRecord = await skillsModel.getFor(
            data.user.id,
            'woodcutting'
        );

        const reward = locationDetails.commands.chop[args[0]];

        let xpGain = reward.xp;
        if (
            data.user.max_area === 'tutorial' &&
            parseInt(skillRecord.xp) + reward.xp > skillsHelper.xpForLevel(3)
        ) {
            let diff = skillsHelper.xpForLevel(3) - parseInt(skillRecord.xp);
            if (diff < 0) diff = 0;
            xpGain = diff;
        }
        if (xpGain > 0) await skillsModel.addXp(skillRecord.id, xpGain);
        await inventoryModel.add(data.user.id, reward.id, 1);

        await questsHelper.check('chop', args[0], 1, data.user, msg);

        const item = await itemsModel.get(reward.id);
        return msg.channel.send(
            `**${data.user.name}** chopped a tree and got a ${item.name} ${
                xpGain > 0 ? `and ${xpGain}xp!` : ''
            }`
        );
    },
};
