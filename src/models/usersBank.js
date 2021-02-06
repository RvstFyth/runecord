const db = require('../db').getConnection();

module.exports = {
    table: 'users_bank',

    async create(userID, itemID, amount) {
        return new Promise((resolve) => {
            db.query(
                `INSERT INTO ${this.table} (user_id, item_id, amount) VALUES (?,?,?)`,
                [userID, itemID, amount],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },

    async getFor(userID, itemID) {
        return new Promise((resolve) => {
            db.query(
                `SELECT * FROM ${this.table} WHERE user_id = ? AND item_id = ?`,
                [userID, itemID],
                (err, rows) => {
                    if (err) console.log(err);
                    else resolve(rows[0]);
                }
            );
        });
    },

    async getAllForPaginated(userID, offset, limit) {
        return new Promise((resolve) => {
            db.query(
                `SELECT * FROM ${this.table} WHERE user_id = ? LIMIT ?, ?`,
                [userID, offset, limit],
                (err, rows) => {
                    if (err) console.log(err);
                    else resolve(rows);
                }
            );
        });
    },

    async add(userID, itemID, amount) {
        const existingRecord = await this.getFor(userID, itemID);
        if (!existingRecord) return this.create(userID, itemID, amount);

        return new Promise((resolve) => {
            db.query(
                `UPDATE ${this.table} SET amount = amount + ? WHERE user_id = ? AND item_id = ?`,
                [amount, userID, itemID],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },
};
