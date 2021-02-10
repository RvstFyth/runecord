module.exports = {
    label: 'Financial advisor',

    async talk(data) {
        return `Small explanation about the bank command\n\nUser is done with tutorial here. \n\`${data.prefix}travel lumbridge\``;
    },
};
