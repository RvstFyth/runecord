const db = require('../db').getConnection();

module.exports = {

    table: 'users_inventory',

    async create(userID, itemID, prefix = '')
    {
        return new Promise(resolve => {
            db.query(`INSERT INTO ${this.table} (user_id, item_id, prefix) VALUES (?,?,?)`, [userID, itemID, prefix], (err, res) => {
                if(err) console.log(err);
                else resolve(res.insertId);
            })
        });
    },

    async getAllFor(userID)
    {
        return new Promise(resolve => {
            db.query(`SELECT * FROM ${this.table} WHERE user_id = ?`, [userID], (err, res) => {
                if(err) console.log(err);
                else resolve(res.insertId);
            })
        });
    }
};