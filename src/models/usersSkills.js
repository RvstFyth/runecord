const db = require('../db').getConnection();

module.exports = {

    table: 'users_skills',

    async create(userID, skill)
    {
        return new Promise(resolve => {
            db.query(`INSERT INTO ${this.table} (user_id, skill) VALUES (?,?)`, [userID, skill], (err, res) => {
                if(err) console.log(err);
                else resolve(res.insertId);
            });
        });
    },

    async getAllFor(userID)
    {
        return new Promise(resolve => {
            db.query(`SELECT * FROM ${this.table} WHERE user_id = ?`, [userID], (err, rows) => {
                if(err) console.log(err);
                else resolve(rows);
            })
        });
    }
};