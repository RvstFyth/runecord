const usersLocksModel = require('../models/usersLocks');
const usersModel = require('../models/users');

const areasHelper = require('../helpers/areas');
const valuesHelper = require('../helpers/values');

module.exports = {

    async run(msg, args, data)
    {
        if(!args[0]) return msg.channel.send(`**${data.user.name}** please specify which location you want to travel too`);

        let input = args.join(' ');

        const areaDetails = await areasHelper.getAreaModules(data.user.area);
        // console.log(areaDetails)
        const validLocations = [];
        for(let i in areaDetails.locations) {
            validLocations.push(areaDetails.locations[i].label.toLowerCase());
        }

        if(validLocations.indexOf(input) < 0) return msg.channel.send(`**${data.user.name}** please specify a valid location. You can see the locations in your area with \`${data.prefix}area\``);

        const requestedLocation = areasHelper.getLocationNameForLabelAndArea(data.user.area, input);
        if(requestedLocation === data.user.location) return msg.channel.send(`**${data.user.name}** you are already at ${input}..`);

        const ts = parseInt(valuesHelper.currentTimestamp()) + 60;

        await usersLocksModel.create(data.user.id, `You are walking towards ${input}`, ts);
        await usersModel.setLocation(data.user.id, requestedLocation);

        return msg.channel.send(`**${data.user.name}** started to walk towards ${input}`);
    },
};