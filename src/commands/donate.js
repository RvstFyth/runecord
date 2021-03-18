module.exports = {
    async run(msg, args, data) {
        const embed = {
            description:
                `You can support the development of this bot with [Donatebot.io](https://donatebot.io/checkout/803223425258618901) which uses paypal. \n` +
                `You can choose for a one-time payment or a monthly subscription. Besides getting a fancy role on our support server, you will also get 1 RCC for each USD donated\n` +
                `You can use RCC for buying membership or XP lamps.\n\n` +
                `**Donate with crypto**:\n` +
                `After sending a transaction, ask a staff member on our support server to verify and grant rewards. If you want to donate with another coin, contact a developer on our support server.\n\n` +
                `BTC: \`1PTsd6AB1kRbstvbAfHBLjXQp2jGAmx6xt\`\n` +
                `ETH: \`0xb6bed45F7edd50D4aDCFD8839fdA57C41AC2b3Cb\`\n` +
                `UBQ: \`0xdcFd4CBA0A1580F3D76741e4c9449f170adb60cE\`\n`,
        };

        return msg.channel.send({ embed });
    },
};
