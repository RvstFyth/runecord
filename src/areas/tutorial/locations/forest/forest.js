module.exports = {
    label: `Forest`,
    description: `Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat. Het grappige is, dat mensen deze toch vaak lezen. Zelfs als men weet dat het om een faketekst gaat, lezen ze toch door.`,
    // commands: ['chop']
    commands: {
        // chop: ['tree']
        chop: {
            tree: {
                xp: 25,
                id: 1,
                level: 1,
                label: 'logs',
            },
        },
        fish: {
            shrimps: {
                xp: 10,
                id: 33,
                level: 1,
                label: 'raw shrimps',
            },
        },
    },
    mobs: {
        rat: {
            xp: 8,
            attackType: 'crush',
            stats: {
                combat: {
                    hitpoints: 2,
                    attack: 1,
                    strength: 1,
                    defence: 1,
                    magic: 1,
                    ranged: 1,
                },
                aggressive: {
                    attack: -47,
                    strength: -53,
                    magic: 0,
                    magicDamage: 0,
                    ranged: 0,
                    rangedStrength: 0,
                },
                defence: {
                    stab: -42,
                    slash: -42,
                    crush: -42,
                    magic: -42,
                    ranged: -42,
                },
                immunities: { poison: false, venom: false },
            },
            loot: {
                53: {
                    min: 1,
                    max: 1,
                    chance: 100,
                },
            },
        },
    },
};
