module.exports = {
    label: 'Chicken farm',
    description:
        'Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat.',

    mobs: {
        chicken: {
            amount: 3,
            respawnTicks: 3,
            xp: 8,
            attackType: 'stab',
            stats: {
                combat: {
                    hitpoints: 3,
                    attack: 1,
                    strength: 1,
                    defence: 1,
                    magic: 1,
                    ranged: 1,
                },
                aggressive: {
                    attack: -47,
                    strength: -42,
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
                60: {
                    min: 1,
                    max: 1,
                    chance: 100,
                },
                2: {
                    min: 5,
                    max: 5,
                    chance: 50,
                },
            },
        },
    },
};
