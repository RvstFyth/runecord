const recipesModel = require('../models/recipesSmithing');
const itemsModel = require('../models/items');
const cookingRecipesModel = require('../models/recipesCooking');

const validArgs = ['smithing', 'smith', 'cooking', 'cook'];

module.exports = {
    async run(msg, args, data) {
        if (args[0]) {
            if (validArgs.indexOf(args[0]) > -1)
                return this.smithing(msg, args, data);
        }
    },

    async smithing(msg, args, data) {
        let recipes;
        if (args[0] === 'smithing' || args[0] === 'smith')
            recipes = await recipesModel.getForLevel(
                data.char.skills.smithing.level
            );
        else if (args[0] === 'cook' || args[0] === 'cooking')
            recipes = await cookingRecipesModel.getForLevel(
                data.char.skills.cooking.level
            );

        const limit = 10;
        let page = args[1] && !isNaN(args[1]) ? parseInt(args[1]) : 1;
        const maxPage = Math.ceil(recipes.length / limit);
        if (page > maxPage) page = maxPage;
        const offset = page * limit - limit;

        recipes = recipes.slice(offset, offset + limit);

        const fields = [];
        for (let i in recipes) {
            const item = await itemsModel.get(recipes[i].item_id);
            let ingredientsString = '';
            const tmp = recipes[i].items.split(';');
            for (let i of tmp) {
                const spl = i.split(':');
                const tmpItem = await itemsModel.get(spl[0]);
                ingredientsString += `${spl[1]} x ${tmpItem.name}\n`;
            }
            const name = recipes[i].alias ? recipes[i].alias : item.name;
            fields.push({
                name: `${name} (${recipes[i].level})`,
                value: ingredientsString,
                inline: true,
            });
        }
        const embed = {
            title: `Smithing recipes lvl ${data.char.skills.smithing.level}`,
            fields,
            footer: {
                text: `Page ${page}/${maxPage}`,
            },
        };

        return msg.channel.send({ embed });
    },
};
