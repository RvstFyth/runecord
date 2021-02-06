const db = require('../db').getConnection();

module.exports = {
    table: 'users',

    create(discord_id, name) {
        return new Promise((resolve) => {
            db.query(
                "INSERT INTO users (`discord_id`, `name`, `location`) VALUES (?,?, 'start')",
                [discord_id, name],
                (err, res) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else resolve(res.insertId);
                }
            );
        });
    },

    getForDiscordID(discord_id) {
        return new Promise((resolve) => {
            db.query(
                'SELECT * FROM users WHERE discord_id = ?',
                [discord_id],
                (err, results) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else resolve(results[0]);
                }
            );
        });
    },

    getTotalRecords() {
        return new Promise((resolve) => {
            db.query(
                'SELECT COUNT(*) AS total FROM users WHERE 1',
                (err, rows) => {
                    if (err) console.log(err);
                    else resolve(rows[0].total);
                }
            );
        });
    },

    async setLocation(id, location) {
        return new Promise((resolve) => {
            db.query(
                `UPDATE ${this.table} SET location = ? WHERE id = ?`,
                [location, id],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },

    async setWorld(id, world) {
        return new Promise((resolve) => {
            db.query(
                `UPDATE ${this.table} SET world = ? WHERE id = ?`,
                [world, id],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },
};
