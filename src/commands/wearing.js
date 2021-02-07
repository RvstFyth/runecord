const equippedModel = require('../models/usersEquipped');
const valuesHelper = require('../helpers/values');
const itemsModel = require('../models/items');

module.exports = {
    async run(msg, args, data) {
        const userRecord = await equippedModel.getFor(data.user.id);

        const fields = [];
        for (let i in userRecord) {
            if (i !== 'user_id') {
                let value = '...';
                const tmpItem = await itemsModel.get(userRecord[i]);
                if(tmpItem) value = tmpItem.name;
                fields.push({
                    name: valuesHelper.ucfirst(i),
                    value: value,
                    inline: true,
                });
            }
        }

        const embed = {
            title: `${data.user.name} wearing`,
            fields,
        };

        return msg.channel.send({ embed });
    },
};
