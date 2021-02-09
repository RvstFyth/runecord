const combatHelper = require('../helpers/combat');

module.exports = {
    async run(msg, args, data) {
        const effectiveLevelMaxHit = combatHelper.calculateEffectiveLevelMaxHit(
            data.char
        );
        const effectiveLevelMaxAttack = combatHelper.calculateEffectiveLevelMaxAttack(
            data.char
        );
        const maxHit = await combatHelper.calculateMaxHit(data.char);
        const maxAttack = await combatHelper.calculateMaxAttack(data.char);

        return msg.channel.send({
            embed: {
                title: `test`,
                description:
                    `` +
                    `Effective level max hit: ${effectiveLevelMaxHit}\n` +
                    `Max hit: ${maxHit}\n` +
                    `Effective level max attack: ${effectiveLevelMaxAttack}\n` +
                    `Max attack: ${maxAttack}\n`,
            },
        });
    },
};
