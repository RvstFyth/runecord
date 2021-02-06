const inventoryModel = require('../models/usersInventory');

module.exports = {
    async run(msg, args, data) {
        await inventoryModel.add(data.user.id, 2, 12, '');
        msg.channel.send('nerd');
    },
};
