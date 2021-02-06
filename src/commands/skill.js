const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');

module.exports = {
    async run(msg, args, data) {
        if (args[0]) {
            const skillRecord = await skillsModel.getFor(
                data.user.id,
                args[0].toLowerCase()
            );
            if (skillRecord) {
                const level = skillsHelper.levelForXp(skillRecord.xp);
                const totalForNextLevel = skillsHelper.xpForLevel(level + 1);
                const totalXp = parseInt(skillRecord.xp);
                const remainder = totalForNextLevel - totalXp;

                const embed = {
                    title: `${data.user.name} ${skillRecord.skill}`,
                    description:
                        `` +
                        `Level: ${level}\n` +
                        `Total xp: ${skillRecord.xp}\n` +
                        `Total next level: ${totalForNextLevel}\n` +
                        `Remaining: ${remainder}`,
                };

                await msg.channel.send({ embed });
            }
        }
    },
};
