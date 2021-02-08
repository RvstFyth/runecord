const equippedModel = require('../models/usersEquipped');
const valuesHelper = require('../helpers/values');
const itemsModel = require('../models/items');

module.exports = {
    async run(msg, args, data) {
        const userRecord = await equippedModel.getFor(data.user.id);

        const fields = [];
        for (let i in userRecord) {
            if (i !== 'user_id') {
                let value = '...';
                const tmpItem = await itemsModel.get(userRecord[i]);
                if (tmpItem) value = tmpItem.name;
                fields.push({
                    name: valuesHelper.ucfirst(i),
                    value: value,
                    inline: true,
                });
            }
        }
        const attackBonus = {
            stab: 0,
            slash: 0,
            crush: 0,
            magic: 0,
            ranged: 0,
        };
        const defenceBonus = {
            stab: 0,
            slash: 0,
            crush: 0,
            magic: 0,
            ranged: 0,
        };
        const otherBonusses = {
            melee: 0,
            ranged: 0,
            magic: 0,
        };

        fields.push({
            name: 'Attack bonus',
            inline: true,
            value: `Stab: ${attackBonus.stab}\nSlash: ${attackBonus.slash}\nCrush: ${attackBonus.crush}\nMagic: ${attackBonus.magic}\nRange: ${attackBonus.ranged}`,
        });

        fields.push({
            name: 'Defence bonus',
            inline: true,
            value: `Stab: ${defenceBonus.stab}\nSlash: ${defenceBonus.slash}\nCrush: ${defenceBonus.crush}\nMagic: ${defenceBonus.magic}\nRange: ${defenceBonus.ranged}`,
        });

        fields.push({
            name: 'Other bonusses',
            inline: true,
            value: `Melee: ${otherBonusses.melee}\nRanged: ${otherBonusses.ranged}\nMagic: ${otherBonusses.magic}`,
        });

        const embed = {
            title: `${data.user.name} wearing`,
            fields,
        };

        return msg.channel.send({ embed });
    },
};
