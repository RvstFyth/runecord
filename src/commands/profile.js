module.exports = {
    async run(msg, args, data) {
        const fields = [];
        fields.push({
            name: '\u200b',
            value: `` + `Health: ${data.user.health}`,
        });
        const embed = {
            title: data.user.name,
        };
    },
};
