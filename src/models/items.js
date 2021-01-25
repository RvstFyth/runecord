const db = require('../db').getConnection();

module.exports = {

    table: 'items',

    async get(id)
    {
        return new Promise(resolve => {
            db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id], (err, rows) => {
               if(err) console.log(err);
               else resolve(rows[0]);
            });
        });
    }
};