const db = require('../db').getConnection();
const valuesHelper = require('../helpers/values');

module.exports = {
    table: 'users_locks',

    async create(userID, message, endTimestamp) {
        return new Promise((resolve) => {
            const values = [userID, message, endTimestamp];
            db.query(
                `INSERT INTO ${this.table} (user_id, message, end_timestamp) VALUES (?,?,?)`,
                values,
                (err, res) => {
                    if (err) console.log(err);
                    else resolve(res.insertId);
                }
            );
        });
    },

    async getFor(userID) {
        return new Promise((resolve) => {
            const ts = valuesHelper.currentTimestamp();
            db.query(
                `SELECT * FROM ${this.table} WHERE user_id = ? AND (end_timestamp < 0 OR end_timestamp > ?)`,
                [userID, ts],
                (err, rows) => {
                    if (err) console.log(err);
                    else resolve(rows[0]);
                }
            );
        });
    },

    async delete(id) {
        return new Promise((resolve) => {
            db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id], (err) => {
                if (err) console.log(err);
                else resolve(true);
            });
        });
    },

    async deleteWhereMinus() {
        return new Promise((resolve) => {
            db.query(
                `DELETE FROM ${this.table} WHERE end_timestamp < 0`,
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },
};
