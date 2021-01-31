const valuesHelper = require('../helpers/values');

const worlds = [
    {
        id: 1, name: `World 1`, premium: false, players: {}, objects: []
    },
    {
        id: 2, name: `World 2`, premium: false, players: {}, objects: []
    },
    {
        id: 3, name: `World 3`, premium: false, players: {}, objects: []
    },
    {
        id: 4, name: `World 4`, premium: true, players: {}, objects: []
    },
    {
        id: 5, name: `World 5`, premium: true, players: {}, objects: []
    },
    {
        id: 6, name: `World 6`, premium: true, players: {}, objects: []
    }

];

const getWorldForId = (id) => {
    return worlds.filter(w => w.id === id)[0];
};

module.exports = {

    init()
    {
        // Set interval to remove inactive players
        setInterval(() => {
            for(let w of worlds) {
                console.log(`running cleanup for world ${w.name}`)
                for(let p in w.players) {
                    if(w.players[p].ts + 60 < valuesHelper.currentTimestamp()) delete w.players[p];
                }
            }
        }, 60 * 1000);
    },

    getPlayersOnLocation(world, area, location)
    {
        const wData = getWorldForId(world);
        return Object.values(wData.players).filter(p => p.area === area && p.location === location).map(p => p.name);
    },

    registerPlayer(world, name, id, location, area)
    {
        getWorldForId(world).players[id] = {
            name: name,
            id: id,
            ts: valuesHelper.currentTimestamp(),
            area: area,
            location: location
        }
    }
};