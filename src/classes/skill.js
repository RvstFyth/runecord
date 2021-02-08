const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');

class Skill {
    constructor(id, name, xp) {
        this.id = id;
        this.name = name;
        this.xp = parseInt(xp);
        this.level = skillsHelper.levelForXp(this.xp);
        this.nextLevel = skillsHelper.xpForLevel(this.level + 1);
        this.remainder = this.nextLevel - this.xp;
    }

    addXp(amount) {
        this.xp += parseInt(amount);
        skillsModel.addXp(this.id, amount);
    }
}

module.exports = Skill;
