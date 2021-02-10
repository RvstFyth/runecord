const areaHelper = require('../helpers/areas');

module.exports = {
    async run(msg, args, data) {
        const areas = areaHelper.getAreas();
        return msg.channel.send(areas.join(', '));
    },
};
