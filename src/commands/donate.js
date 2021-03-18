module.exports = {
    async run(msg, args, data) {
        const embed = {
            description:
                `You can support the development of this bot with [Donatebot.io](https://donatebot.io/checkout/803223425258618901) which uses paypal. \n` +
                `You can choose for a one-time payment or a monthly subscription. Besides getting a fancy role on our support server, you will also get 1 RCC for each USD donated\n` +
                `You can use RCC for buying membership or XP lamps.`,
        };

        return msg.channel.send({ embed });
    },
};
