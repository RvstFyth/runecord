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
        attack: {
            rat: {
                xp: 10,
                level: 1,
                stats: {
                    hitpoints: 2,
                    attack: 1,
                    strength: 1,
                    defence: 1,
                    magic: 1,
                    ranged: 1,
                },
            },
        },
    },
};
