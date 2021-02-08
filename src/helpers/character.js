const skillsModel = require('../models/usersSkills');

const Character = require('../classes/character');
const Skill = require('../classes/skill');

module.exports = {
    async composeFromUserRecord(record) {
        const char = new Character(record.id, record.name);
        char.setArea(record.area);
        char.setLocation(record.location);
        char.setGold(record.gold);
        char.setRcCoins(record.rccoins);
        char.setWorld(record.world);
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
