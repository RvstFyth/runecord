const db = require('../db').getConnection();


module.exports = {

    table: 'users_equipped',

    async create(userID)
    {
        return new Promise(resolve => {
            db.query(`INSERT INTO ${this.table} (user_id) VALUES (?)`, [userID], (err) => {
                if(err) console.log(err);
                else resolve(true);
            });
        });
    },

    async getFor(userID)
    {
        return new Promise(resolve => {
            db.query(`SELECT * FROM ${this.table} WHERE user_id = ?`, [userID], async (err, rows) => {
                if(err) console.log(err);
                else {
                    if(!rows[0]) {
                        await this.create(userID);
                        rows = [await this.getFor(userID)];
                    }
                    resolve(rows[0]);
                }
            });
        });
    }
};