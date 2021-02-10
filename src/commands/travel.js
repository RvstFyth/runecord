module.exports = {
    async run(msg, args, data) {
        if (!args[0])
            return msg.channel.send(
                `**${data.user.name}** where do you want to travel too?`
            );
        if (args[0] === 'tutorial')
            return msg.channel.send(
                `**${data.user.name}** you can't travel back to tutorial island...`
            );
    },
};
