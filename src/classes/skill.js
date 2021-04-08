const skillsModel = require('../models/usersSkills');
const skillsHelper = require('../helpers/skills');
const supportServer = require('../helpers/supportServer');

class Skill {
    constructor(id, name, xp, char) {
        this.id = id;
        this.name = name;
        this.xp = parseInt(xp);
        this.level = skillsHelper.levelForXp(this.xp);
        this.nextLevel = skillsHelper.xpForLevel(this.level + 1);
        this.remainder = this.nextLevel - this.xp;
        this.char = char;
    }

    async addXp(amount, maxLevel = false) {
        if (maxLevel) {
            const maxXp = skillsHelper.xpForLevel(3);
            if (this.xp + amount > maxXp) {
                let diff = maxXp - this.xp;
                if (diff < 0) diff = 0;
                amount = diff;
            }
        }
        if (amount > 0) {
            const xpNextLevel = skillsHelper.xpForLevel(this.level + 1);
            const diff = xpNextLevel - this.xp;
            this.xp += parseInt(amount);
            this.level = skillsHelper.levelForXp(this.xp);
            if (amount >= diff) {
                supportServer.pushToCharLogChannel(
                    `${this.char.name} advanced ${this.name} to level ${this.level}!`
                );
            }
            await skillsModel.addXp(this.id, amount);
        }
        return amount;
    }
}

module.exports = Skill;
