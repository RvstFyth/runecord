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
            const dirsToLoop = ['locations', 'npcs'];
            for(let z of dirsToLoop) {
                fs.readdirSync(`${path}/${d}/${z}`).forEach(file => {
                    if (file.match(/\.js$/) !== null) {
                        _areasCache[d][z][file.replace('.js', '')] = require(`.${path}/${d}/${z}/${file}`);
                        console.log(_areasCache[d][z][file.replace('.js', '')].label);
                    }
                })
            }
        }
    },

    async getAreaModules(area)
    {
        if(_areasCache[area]) return _areasCache[area];
        return null;
    }
};