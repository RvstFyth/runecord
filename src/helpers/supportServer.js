const config = require('../config.json');

module.exports = {
    client: null,
    channels: {},

    setClient(client) {
        this.client = client;
    },

    pushToCharLogChannel(msg) {
        if (config.support_member_log_channel_id) {
            const channel = this.client.channels.cache.find(
                (c) => c.id == config.support_member_log_channel_id
            );
            if (channel) {
                channel.send(msg);
            }
        } else console.log(`CharLogChannel: ${msg}`);
    },
};
