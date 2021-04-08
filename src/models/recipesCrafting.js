const db = require('../db').getConnection();

module.exports = {
    table: 'recipes_crafting',
    async getForItemID(itemID) {
        return new Promise((resolve) => {
            db.query(
                `SELECT * FROM ${this.table} WHERE item_id = ?`,
                [itemID],
                (err, rows) => {
                    if (err) console.log(err);
                    else {
                        if (!rows[0]) return resolve(false);
                        const row = rows[0];
                        if (row.items) {
                            const res = {};
                            for (let p of row.items.split(';')) {
                                const pp = p.split(':');
                                res[pp[0]] = parseInt(pp[1]);
                            }
                            row.items = res;
                        }
                        if (row.requires) {
                            const res = {};
                            for (let p of row.requires.split(';')) {
                                const pp = p.split(':');
                                res[pp[0]] = parseInt(pp[1]);
                            }
                            row.requires = res;
                        }

                        resolve(row);
                    }
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
