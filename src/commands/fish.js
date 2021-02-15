const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');
const random = require('../helpers/random');

module.exports = {
    async run(msg, args, data) {
        const locationDetails = areasHelper.getLocation(
            data.user.area,
            data.user.location
        );
        if (
            !locationDetails.commands ||
            (locationDetails.commands && !locationDetails.commands.fish)
        )
            return msg.channel.send(
                `**${data.user.name}** you can't fish here?!?`
            );

        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to fish with?!?`
            );
        if (!locationDetails.commands.fish[args[0]])
            return msg.channel.send(
                `**${data.user.name}** you can't fish with a ${args[0]} here..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        if (occupiedSlots >= 28)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

        const skillRecord = await skillsModel.getFor(data.user.id, 'fishing');

        const rewards = Object.values(
            locationDetails.commands.fish[args[0]]
        ).filter((o) => o.level <= data.char.skills.fishing.level);

        const reward = random.arrayValue(rewards);

        if (
            data.user.area === 'tutorial' &&
            parseInt(skillRecord.xp) + reward.xp > skillsHelper.xpForLevel(3)
        ) {
            let diff = skillsHelper.xpForLevel(3) - parseInt(skillRecord.xp);
            if (diff < 0) diff = 0;
            reward.xp = diff;
        }
        if (reward.xp > 0) await skillsModel.addXp(skillRecord.id, reward.xp);
        await inventoryModel.add(data.user.id, reward.id, 1);

        const item = await itemsModel.get(reward.id);
        await questsHelper.check('fish', item.name, 1, data.user, msg);

        return msg.channel.send(
            `**${data.user.name}** caught a ${item.name} ${
                reward.xp > 0 ? `and ${reward.xp}xp!` : ''
            }`
        );
    },
};
