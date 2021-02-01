const inventoryModel = require('../models/usersInventory');
const areasHelper = require('../helpers/areas');
const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');

const logsMapping = {
    logs: { id: 1, label: 'logs', level: 1, xp: 40 },
    achey: { label: 'achey logs', level: 1, xp: 40 }
};

module.exports = {

    async run(msg, args, data)
    {
        if(!args[0]) return msg.channel.send(`**${data.user.name}** what are you trying to light?!?`);

        if(!logsMapping[args[0]]) return msg.channel.send(`**${data.user.name}** you can't light ${args[0]}..`);
        const logType = {...logsMapping[args[0]]};

        const skillRecord = await skillsModel.getFor(data.user.id, 'firemaking');
        const skillLevel = skillsHelper.levelForXp(skillRecord.xp);
        if(skillLevel < logType.level) return msg.channel.send(`**${data.user.name}** you need firemaking level ${logType.level}..`);

        let userLogs = await inventoryModel.getFor(data.user.id, 1);
        if(!userLogs || userLogs.amount < 1) return msg.channel.send(`**${data.user.name}** you don't have any ${args[0]}`);
        else userLogs = userLogs[0];

        if(data.user.max_area === 'tutorial' && (parseInt(skillRecord.xp) + logType.xp > skillsHelper.xpForLevel(3))) {
            let diff = skillsHelper.xpForLevel(3) - parseInt(skillRecord.xp);
            if(diff < 0) diff = 0;
            logType.xp = diff;
        }
        if(logType.xp > 0) await skillsModel.addXp(skillRecord.id, logType.xp);
        await inventoryModel.setAmount(userLogs.id, parseInt(userLogs.amount) - 1);

        return msg.channel.send(`**${data.user.name}** lighted made a fire and got ${logType.xp}xp`)
    }
};