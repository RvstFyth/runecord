const db = require('../db').getConnection();

module.exports = {
    table: 'recipes_smithing',

    async getForItemID(itemID) {
        return new Promise((resolve) => {
            db.query(
                `SELECT * FROM ${this.table} WHERE item_id = ?`,
                [itemID],
                (err, rows) => {
                    if (err) console.log(err);
                    else resolve(rows[0]);
                }
            );
        });
    },

    async getForLevel(level) {
        return new Promise((resolve) => {
            db.query(
                `SELECT * FROM ${this.table} WHERE level <= ? ORDER BY level DESC`,
                [level],
                (err, rows) => {
                    if (err) console.log(err);
                    else resolve(rows);
                }
            );
        });
    },
};
