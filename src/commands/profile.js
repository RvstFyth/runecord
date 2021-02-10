module.exports = {
    async run(msg, args, data) {
        const fields = [];
        fields.push({
            name: '\u200b',
            value:
                `` +
                `Health: ${data.user.health}/${data.char.skills.hitpoints.level}\n`,
        });
        const embed = {
            title: data.user.name,
            fields,
        };

        return msg.channel.send({ embed });
    },
};
