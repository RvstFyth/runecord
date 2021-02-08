const inventoryModel = require('../models/usersInventory');
const skillsModel = require('../models/usersSkills');
const usersModel = require('../models/users');

class Character {
    constructor(id, name) {
        // Set default values
        this.id = id;
        this.name = name;
        this.gold = 0;
        this.rccoins = 0;
        this.world = 1;
        this.area = 'tutorial';
        this.location = 'start';
        this.supporter = false;

        this.skills = {};
    }

    setSupporter() {
        this.supporter = true;
    }

    async setArea(val, update = false) {
        this.area = val;
        if (update) await usersModel.setArea(this.id, this.area);
    }

    async setLocation(val, update = false) {
        this.location = val;
        if (update) await usersModel.setLocation(this.id, this.location);
    }

    setWorld(val) {
        this.world = val;
    }

    setGold(val) {
        this.gold = val;
    }

    setRcCoins(val) {
        this.rccoins = val;
    }

    setSkill(skillInstance) {
        this.skills[skillInstance.name] = skillInstance;
    }
}

module.exports = Character;
