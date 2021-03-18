module.exports = {
    async run(msg, args, data) {
        const embed = {
            description:
                `You can help us grow by [voting for RuneCord](https://top.gg/bot/810939932817227786/vote)\nYou will get a XP lamp as reward, that grants XP in a skill of choice. Use \`${data.prefix}lamp [skill]\` to use a lamp.\n` +
                `After voting you can find the XP lamp in your bank!`,
        };

        return msg.channel.send({ embed });
    },
};
