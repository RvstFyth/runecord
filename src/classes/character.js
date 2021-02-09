const inventoryModel = require('../models/usersInventory');
const usersModel = require('../models/users');
const itemsModel = require('../models/items');
const equippedModel = require('../models/usersEquipped');

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
        this.equipped = {};
        this.equippedBonus = {
            attack: {
                stab: 0,
                slash: 0,
                crush: 0,
                magic: 0,
                ranged: 0,
            },
            defence: {
                stab: 0,
                slash: 0,
                crush: 0,
                magic: 0,
                ranged: 0,
            },
            other: {
                melee: 0,
                ranged: 0,
                magic: 0,
                prayer: 0,
            },
        };
    }

    async getEquipped() {
        if (!Object.keys(this.equipped).length) {
            await this.loadEquipment();
        }
        return this.equipped;
    }

    async getEquippedBonus() {
        if (!Object.keys(this.equipped).length) {
            await this.loadEquipment();
        }
        return this.equippedBonus;
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

    async loadEquipment() {
        const userRecord = await equippedModel.getFor(this.id);
        for (let i in userRecord) {
            if (i === 'user_id') continue;
            this.equipped[i] = userRecord[i];
            if (this.equipped[i]) {
                const item = await itemsModel.get(this.equipped[i]);
                if (item) {
                    const parsedMeta = JSON.parse(item.meta);
                    if (parsedMeta && parsedMeta.stats) {
                        item.stats = parsedMeta.stats;
                        for (let i in item.stats.attack)
                            this.equippedBonus.attack[i] = item.stats.attack[i];
                        for (let i in item.stats.defence)
                            this.equippedBonus.defence[i] =
                                item.stats.defence[i];
                        for (let i in item.stats.other)
                            this.equippedBonus.other[i] = item.stats.other[i];
                    }
                    this.equipped[i] = item;
                }
            }
        }
    }
}

module.exports = Character;
