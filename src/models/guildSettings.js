const db = require('../db').getConnection();

module.exports = {
    tableName: 'guild_settings',

    async create(guild_id, prefix) {
        return new Promise((resolve) => {
            db.query(
                `INSERT INTO ${this.tableName} (guild_id, prefix) VALUES (?,?)`,
                [guild_id, prefix],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },

    async getFor(guild_id) {
        return new Promise((resolve) => {
            db.query(
                `SELECT * FROM ${this.tableName} WHERE guild_id = ?`,
                [guild_id],
                (err, rows) => {
                    if (err) console.log(err);
                    else resolve(rows[0]);
                }
            );
        });
    },

    async setPrefix(guild_id, prefix) {
        return new Promise((resolve) => {
            db.query(
                `UPDATE ${this.tableName} SET prefix = ? WHERE guild_id = ?`,
                [prefix, guild_id],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },
};
