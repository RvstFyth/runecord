const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const inventoryModel = require('../models/usersInventory');
const itemsModel = require('../models/items');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');
const emojiHelper = require('../helpers/emojis');

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

        if (
            data.char.skills.woodcutting.level <
            locationDetails.commands.chop[args[0]].level
        )
            return msg.channel.send(
                `**${data.user.name}** you need woodcutting level ${
                    locationDetails.commands.chop[args[0]].level
                } for this..`
            );

        const occupiedSlots = await inventoryModel.getOccupiedSlotCount(
            data.user.id
        );
        if (occupiedSlots >= 28)
            return msg.channel.send(
                `**${data.user.name}** your backpack is full..`
            );

        let axe = await inventoryModel.getWithTypeAndHighestLevel(
            data.user.id,
            'axe'
        );
        if (!axe) {
            /// Check if the user has one equipped
            await data.char.loadEquipment();
            if (data.char.equipped.weapon.type === 'axe') {
                axe = data.char.equipped.weapon;
            }
        }
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
        xpGain = await data.char.skills.woodcutting.addXp(xpGain);
        await inventoryModel.add(data.user.id, reward.id, 1);

        await questsHelper.check('chop', args[0], 1, data.user, msg);

        const item = await itemsModel.get(reward.id);
        const em = await emojiHelper.get(msg.client, 'woodcutting');
        const embed = {
            description: `**${data.user.name}** got a ${item.name} ${em} +${xpGain}`,
        };
        return msg.channel.send({ embed });
    },
};
