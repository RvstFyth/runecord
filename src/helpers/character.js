const skillsModel = require('../models/usersSkills');

const Character = require('../classes/character');
const Skill = require('../classes/skill');

module.exports = {
    async composeFromUserRecord(record) {
        const char = new Character(record.id, record.name);
        await char.setArea(record.area);
        await char.setLocation(record.location);
        char.setGold(record.gold);
        char.setRcCoins(record.rccoins);
        char.setWorld(record.world);
        char.setStyle('melee', record.melee_style);
        char.setStyle('ranged', record.ranged_style);
        char.setStyle('magic', record.magic_style);

        if (record.supporter) char.setSupporter();

        const skillRecords = await skillsModel.getAllFor(record.id);
        for (let i in skillRecords) {
            char.setSkill(
                new Skill(
                    skillRecords[i].id,
                    skillRecords[i].skill,
                    skillRecords[i].xp
                )
            );
        }
        return char;
    },
};
