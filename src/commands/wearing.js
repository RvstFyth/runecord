const valuesHelper = require('../helpers/values');

module.exports = {
    async run(msg, args, data) {
        const fields = [];

        const equipped = await data.char.getEquipped();
        for (let i in equipped) {
            let value = '...';
            if (equipped[i]) {
                value = equipped[i].name;
            }
            fields.push({
                name: valuesHelper.ucfirst(i),
                value: value,
                inline: true,
            });
        }

        const equippedBonus = await data.char.getEquippedBonus();
        const attackBonus = equippedBonus.attack;
        const defenceBonus = equippedBonus.defence;
        const otherBonus = equippedBonus.other;

        fields.push({
            name: '\u200b',
            inline: true,
            value: '\u200b',
        });

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
            value: `Melee: ${otherBonus.melee}\nRanged: ${otherBonus.ranged}\nMagic: ${otherBonus.magic}\nPrayer: ${otherBonus.prayer}`,
        });

        const embed = {
            title: `${data.user.name} wearing`,
            fields,
        };

        return msg.channel.send({ embed });
    },
};
