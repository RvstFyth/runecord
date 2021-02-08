const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');

module.exports = {
    async run(msg, args, data) {
        if (args[0]) {
            const skill = data.char.skills[args[0]];
            if (skill) {
                const embed = {
                    title: `${data.user.name} ${skill.name}`,
                    description:
                        `` +
                        `Level: ${skill.level}\n` +
                        `Total xp: ${skill.xp}\n` +
                        `Total next level: ${skill.nextLevel}\n` +
                        `Remaining: ${skill.remainder}`,
                };

                await msg.channel.send({ embed });
            }
        }
    },
};
