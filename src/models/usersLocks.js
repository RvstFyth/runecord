const db = require('../db').getConnection();
const valuesHelper = require('../helpers/values');


module.exports = {

    table: 'users_locks',

    async create(userID, message, endTimestamp)
    {
        return new Promise(resolve => {
            const values = [userID, message, endTimestamp];
            db.query(`INSERT INTO ${this.table} (user_id, message, end_timestamp) VALUES (?,?,?)`, values, (err, res) => {
                if(err) console.log(err);
                else resolve(res.insertId);
            })
        });
    },

    async getFor(userID)
    {
        return new Promise(resolve => {
            const ts = valuesHelper.currentTimestamp();
            db.query(`SELECT * FROM ${this.table} WHERE user_id = ? AND end_timestamp > ?`, [userID, ts], (err, rows) => {
                if(err) console.log(err);
                else resolve(rows[0]);
            })
        });
    }
};