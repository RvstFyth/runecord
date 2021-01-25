const { Random } = require("random-js");

const randomInstance = new Random();

module.exports = {

    number: function(min, max) {
        return randomInstance.integer(min, max);
    }
}