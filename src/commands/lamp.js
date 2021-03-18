const inventoryModel = require('../models/usersInventory');

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** please specify a skill you want to receive XP for..`
            );
        if (!data.char.skills[args[0]])
            return msg.channel.send(
                `**${data.user.name}** invalid skill selected...`
            );

        const lamps = await inventoryModel.getFor(data.user.id, 99);
        if (!lamps[0] || lamps[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you don't have any lamps... You can get those by [voting](https://top.gg/bot/810939932817227786/vote)!`
            );

        const bonus = Math.min(data.char.skills[args[0]].level * 10, 1000);
        await inventoryModel.delete(lamps[0].id);
        await data.char.skills[args[0]].addXp(bonus);

        const embed = {
            description: `**${data.user.name}** used a XP lamp and got ${bonus} XP in ${args[0]}`,
        };

        return msg.channel.send({ embed });
    },
};
