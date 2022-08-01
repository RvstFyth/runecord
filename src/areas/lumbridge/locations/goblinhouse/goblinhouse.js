module.exports = {
    label: 'Goblin house',
    description: ``,
    mobs: {
        goblin: {
            amount: 13,
            maxHit: 1,
            respawnTicks: 100,
            xp: 8,
            attackType: 'crush',
            stats: {
                combat: {
                    hitpoints: 5,
                    attack: 1,
                    strength: 1,
                    defence: 1,
                    magic: 1,
                    ranged: 1,
                },
                aggressive: {
                    attack: -21,
                    strength: -15,
                    magic: -0,
                    magicDamage: 0,
                    ranged: 0,
                    rangedStrength: 0,
                },
                defence: {
                    stab: -15,
                    slash: -15,
                    crush: -15,
                    magic: -15,
                    ranged: -15,
                },
                immunities: { poison: false, venom: false },
            },
            loot: {
                gold: {
                    min: 1,
                    max: 20,
                },
                53: {
                    min: 1,
                    max: 1,
                    chance: 100,
                },
                48: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                83: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                132: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                129: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                130: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
            },
        },
        goblin2: {
            amount: 11,
            maxHit: 1,
            respawnTicks: 100,
            xp: 8,
            attackType: 'crush',
            stats: {
                combat: {
                    hitpoints: 12,
                    attack: 3,
                    strength: 1,
                    defence: 4,
                    magic: 1,
                    ranged: 1,
                },
                aggressive: {
                    attack: 12,
                    strength: 12,
                    magic: -0,
                    magicDamage: 0,
                    ranged: 0,
                    rangedStrength: 0,
                },
                defence: {
                    stab: 0,
                    slash: 0,
                    crush: 0,
                    magic: 0,
                    ranged: 0,
                },
                immunities: { poison: false, venom: false },
            },
            loot: {
                gold: {
                    min: 1,
                    max: 20,
                },
                53: {
                    min: 1,
                    max: 1,
                    chance: 100,
                },
                48: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                83: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                132: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                129: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
                130: {
                    min: 1,
                    max: 1,
                    chance: 3,
                },
            },
        },
        spider: {
            amount: 2,
            respawnTicks: 5,
            xp: 8,
            attackType: 'stab',
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
                    attack: -35,
                    strength: -58,
                    magic: 0,
                    magicDamage: 0,
                    ranged: 0,
                    rangedStrength: 0,
                },
                defence: {
                    stab: -53,
                    slash: -53,
                    crush: -53,
                    magic: -53,
                    ranged: -53,
                },
                immunities: { poison: false, venom: false },
            },
        },
    },
};