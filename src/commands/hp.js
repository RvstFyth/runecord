module.exports = {
    async run(msg, args, data) {
        const hearthEmoji = msg.client.emojis.cache.get('810245315860496415');

        const embed = {
            description: `**${data.user.name}**\n${hearthEmoji} ${data.user.health}/${data.char.skills.hitpoints.level}`,
        };

        return msg.channel.send({ embed });
    },
};
