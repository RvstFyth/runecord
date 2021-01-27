const db = require('../db').getConnection();

module.exports = {

    table: 'users_quests',

    async create(user_id, quest_id)
    {
        return new Promise(resolve => {
            db.query(`INSERT INTO ${this.table} (user_id, quest_id) VALUES (?,?)`, [user_id, quest_id], (err) => {
                if(err) console.log(err);
                else resolve(true);
            });
        });
    },

    async getFor(user_id, quest_id)
    {
        return new Promise(resolve => {
            db.query(`
                    SELECT * 
                    FROM ${this.table} 
                    WHERE user_id = ? AND quest_id = ?`,
                [user_id, quest_id], (err, rows) => {
                if(err) console.log(err);
                else resolve(rows[0]);
            })
        });
    },

    async getActiveFor(user_id)
    {
        return new Promise(resolve => {
            db.query(`
                    SELECT uq.*, q.name, q.description
                    FROM ${this.table} AS uq
                    INNER JOIN quests AS q ON uq.quest_id = q.id
                    WHERE uq.user_id = ? AND uq.completed = 0`,
                [user_id], (err, rows) => {
                    if(err) console.log(err);
                    else resolve(rows);
                })
        });
    }
};