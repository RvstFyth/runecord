const areaHelper = require('../helpers/areas');

module.exports = {
    async run(msg, args, data) {
        const areas = areaHelper.getAreaLabels();
        return msg.channel.send(areas.join(', '));
    },
};
