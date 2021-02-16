const inventoryModel = require('../models/usersInventory');
const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');
const questsHelper = require('../helpers/quests');
const emojisHelper = require('../helpers/emojis');

const logsMapping = {
    logs: { id: 1, label: 'logs', level: 1, xp: 40 },
    achey: { label: 'achey logs', level: 1, xp: 40 },
};

module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** what are you trying to light?!?`
            );

        if (!logsMapping[args[0]])
            return msg.channel.send(
                `**${data.user.name}** you can't light ${args[0]}..`
            );
        const logType = { ...logsMapping[args[0]] };

        const skillRecord = await skillsModel.getFor(
            data.user.id,
            'firemaking'
        );
        const skillLevel = skillsHelper.levelForXp(skillRecord.xp);
        if (skillLevel < logType.level)
            return msg.channel.send(
                `**${data.user.name}** you need firemaking level ${logType.level}..`
            );

        let userLogs = await inventoryModel.getFor(data.user.id, 1);
        if (!userLogs[0] || userLogs[0].amount < 1)
            return msg.channel.send(
                `**${data.user.name}** you don't have any ${args[0]}`
            );
        else userLogs = userLogs[0];

        const xpGain = await data.char.skills.firemaking.addXp(
            logType.xp,
            data.user.area === 'tutorial' ? 3 : false
        );
        await inventoryModel.delete(userLogs.id);

        await questsHelper.check('light', args[0], 1, data.user, msg);

        const em = await emojisHelper.get(msg.client, 'firemaking');

        const embed = {
            description: `**${data.user.name}** made a fire ${em} +${xpGain}`,
        };

        return msg.channel.send({ embed });
    },
};
