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

    async setArea(id, area) {
        return new Promise((resolve) => {
            db.query(
                `UPDATE ${this.table} SET area = ? WHERE id = ?`,
                [area, id],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
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

    async setHealth(id, health) {
        return new Promise((resolve) => {
            health = Math.max(0, health);
            db.query(
                `UPDATE ${this.table} SET health = ? WHERE id = ?`,
                [health, id],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },

    async addGold(id, amount) {
        return new Promise((resolve) => {
            db.query(
                `UPDATE ${this.table} SET gold = gold + ? WHERE id = ?`,
                [amount, id],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },

    async addRcCoins(id, amount) {
        return new Promise((resolve) => {
            db.query(
                `UPDATE ${this.table} SET rccoins = rccoins + ? WHERE id = ?`,
                [amount, id],
                (err) => {
                    if (err) console.log(err);
                    else resolve(true);
                }
            );
        });
    },

    async setStyle(id, style, value) {
        let column;
        switch (style) {
            case 'melee':
                column = 'melee_style';
                break;
            case 'ranged':
                column = 'ranged_style';
                break;
            case 'magic':
                column = 'magic_style';
                break;
        }
        if (column) {
            return new Promise((resolve) => {
                db.query(
                    `UPDATE ${this.table} SET ${column} = ? WHERE id = ?`,
                    [value, id],
                    (err) => {
                        if (err) console.log(err);
                        else resolve(true);
                    }
                );
            });
        }

        return false;
    },

    async delete(id) {
        return new Promise((resolve) => {
            db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id], (err) => {
                if (err) console.log(err);
                else resolve(true);
            });
        });
    },
};
