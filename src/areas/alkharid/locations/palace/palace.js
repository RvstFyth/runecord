module.exports = {
    label: 'Al Kharid palace',
    description: '...\n...',
    mobs: {
        warrior: {
            amount: 9,
            respawnTicks: 25,
            xp: 8,
            maxHit: 2,
            attackType: 'slash',
            stats: {
                combat: {
                    hitpoints: 19,
                    attack: 7,
                    strength: 5,
                    defence: 4,
                    magic: 1,
                    ranged: 1,
                },
                aggressive: {
                    attack: 10,
                    strength: 9,
                    magic: 0,
                    magicDamage: 0,
                    ranged: 0,
                    rangedStrength: 0,
                },
                defence: {
                    stab: 12,
                    slash: 15,
                    crush: 10,
                    magic: -1,
                    ranged: 12,
                },
                immunities: { poison: false, venom: false },
            },
            pickpocket: {
                baseChance: 70,
                xp: 26,
                level: 25,
                loot: {
                    gold: {
                        min: 18,
                        max: 18,
                    },
                },
            },
            loot: {
                gold: {
                    min: 3,
                    max: 25,
                },
                53: {
                    min: 1,
                    max: 1,
                    chance: 100,
                },
                42: {
                    min: 1,
                    max: 1,
                    chance: 2,
                },
                69: {
                    min: 1,
                    max: 1,
                    chance: 2,
                },
                130: {
                    min: 4,
                    max: 4,
                    chance: 3,
                },
                131: {
                    min: 6,
                    max: 6,
                    chance: 3,
                },
                128: {
                    min: 9,
                    max: 9,
                    chance: 2,
                },
                134: {
                    min: 2,
                    max: 2,
                    chance: 2,
                },
            },
        },
    },
};
