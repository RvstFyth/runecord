/**
 * https://oldschool.runescape.wiki/w/Combat_level
 */
module.exports = {
    async run(msg, args, data) {
        const skills = data.char.skills;
        const base =
            0.25 *
            (skills.defence.level +
                skills.hitpoints.level +
                Math.max(0, parseInt(skills.prayer.level / 2)));
        const melee = 0.35 * (skills.attack.level + skills.strength.level);
        const magic =
            0.35 * (parseInt(skills.magic.level / 2) + skills.magic.level);
        const ranged =
            0.35 * (parseInt(skills.ranged.level / 2) + skills.ranged.level);

        const cb = parseInt(base + Math.max(melee, ranged, magic));
        return msg.channel.send(`**${data.user.name}** combat level: ${cb}`);
    },
};
