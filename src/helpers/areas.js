const fs = require('fs');

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}

const _areasCache = {};

module.exports = {


    async init(path)
    {
        const directories = getDirectories(path);
        for(let d of directories) {
            _areasCache[d] = {
                locations: [],
                npcs: [],
                area: require(`.${path}/${d}/${d}.json`)
            };

            const z = 'locations';

            fs.readdirSync(`${path}/${d}/${z}`).forEach(file => {
                const locationName = file.replace('.js', '');
                _areasCache[d][z][locationName] = require(`.${path}/${d}/${z}/${locationName}/${file}`);
                _areasCache[d][z][locationName].npcs = {};
                const npcFolder = `${path}/${d}/locations/${locationName}/npcs`;
                if(fs.existsSync(npcFolder)) {
                    const npcFiles = fs.readdirSync(npcFolder);
                    npcFiles.forEach((file) => {
                        if (file.match(/\.js$/) !== null && file !== 'index.js') {
                            const npcName = file.replace('.js', '');
                            _areasCache[d][z][locationName].npcs[npcName] = require(`.${path}/${d}/locations/${locationName}/npcs/${file}`);
                        }
                    })
                }
            });
        }
    },

    async getAreaModules(area)
    {
        if(_areasCache[area]) return _areasCache[area];
        return null;
    }
};