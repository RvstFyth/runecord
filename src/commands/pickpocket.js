const inventoryModel = require('../models/usersInventory');
const worldsHelper = require('../helpers/worlds');
const areasHelper = require('../helpers/areas');
const random = require('../helpers/random');
const usersModel = require('../models/users');
const emojisHelper = require('../helpers/emojis');

module.exports = {
    async run(msg, args, data) {
        const input = args.join(' ');
        if (!input) {
            return msg.channel.send(`**${data.user.name}** who are you trying to pickpocket?!?`);
        }

        const mobsAtLocation = worldsHelper.getMobs(data.user.world, data.user.area, data.user.location);
        if (!Object.keys(mobsAtLocation).length) return msg.channel.send(`**${data.char.name}** there are no mobs to pickpocket here...`);
        const filteredMobs = Object.values(mobsAtLocation[input]).filter((m) => m.mob.health > 0 && !m.occupied);

        if(!mobsAtLocation[input]) return msg.channel.send(`**${data.user.name}** there is no ${input} here...`);
        if(!mobsAtLocation[input] || !filteredMobs.length) return msg.channel.send(`**${data.user.name}** there is no ${input} here...`);

        const locationData = await areasHelper.getLocation(
            data.user.area,
            data.user.location
        );

        const mob = locationData.mobs[input];
        if(!mob.pickpocket) return msg.channel.send(`**${data.user.name}** you can't pickpocket ${input}...`);

        if (data.char.skills.thieving.level < mob.pickpocket.level) return msg.channel.send(`**${data.user.name}** you need thieving level ${mob.pickpocket.level} for this...`);

        const seconds = random.number(15, 30);

        if (random.number(1, 100) <= mob.pickpocket.baseChance) {
            const xpAdded = await data.char.skills.thieving.addXp(mob.pickpocket.xp);
            const loot = [];
            if (mob.pickpocket.loot.gold) {
                const gold = random.number(mob.pickpocket.loot.gold.min, mob.pickpocket.loot.gold.max);
                loot.push({name: 'gold', amount: gold});
                await usersModel.addGold(data.char.id, gold);
            }

            const lootField = { name: 'Loot', value: '', inline: true };
            for (let i in loot) {
                lootField.value += `${loot[i].amount} x ${loot[i].name}\n`
            }

            const em = await emojisHelper.get(msg.client, 'thieving');
            const xpField = { name: 'XP', value: `${xpAdded} ${em}`, inline: true };

            const embed = {
                description: `**${data.user.name}** successfully pickpocketed ${input}`,
                fields: [lootField, xpField]
            }
            return msg.channel.send({embed});
        }
        else return msg.channel.send(`**${data.user.name}** you failed to pickpocket ${input}..`);
    }
};
