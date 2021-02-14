const usersModel = require('../models/users');

module.exports = {
    async run(msg, args, data) {
        await data.char.loadEquipment();
        if (!data.char.equipped.weapon)
            return msg.channel.send(
                `**${data.user.name}** you need to wield a weapon first..`
            );
        if (!data.char.equipped.weapon.meta)
            return msg.channel.send(
                `**${data.user.name}** something is wrong with the weapon equipped. Please contact a staff member on our support server!`
            );

        const metaParsed = JSON.parse(data.char.equipped.weapon.meta);
        if (!metaParsed.styles)
            return msg.channel.send(
                `**${data.user.name}** something is wrong with the weapon equipped. Please contact a staff member on our support server!`
            );

        if (args[0] && !isNaN(args[0])) {
            // means user wants to switch style
            const selected = parseInt(args[0]);
            const index = selected - 1;
            const styles = Object.keys(metaParsed.styles);
            if (!styles[index])
                return msg.channel.send(
                    `**${data.user.name}** invalid number provided...`
                );
            await usersModel.setStyle(
                data.user.id,
                data.char.combatType,
                selected
            );
            return msg.channel.send(
                `**${data.user.name}** changed their style to ${styles[index]}`
            );
        }

        let description = '';
        let counter = 1;

        let index;
        switch (data.char.combatType) {
            case 'ranged':
                index = 'rangedStyle';
                break;
            case 'magic':
                index = 'magicStyle';
                break;
            case 'melee':
            default:
                index = 'meleeStyle';
                break;
        }

        const charStyle = data.char[index];

        for (let i in metaParsed.styles) {
            description += `${counter}: ${i} ${
                charStyle === counter ? '(selected)' : ''
            }\n`;
            counter++;
        }

        description += `\n\`${data.prefix}styles [no]\` to switch the active combat style.`;

        const embed = {
            title: data.char.equipped.weapon.name,
            description,
        };

        return msg.channel.send({ embed });
    },
};
