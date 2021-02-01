const db = require('../db').getConnection();
const itemsModel = require('./items');

module.exports = {

    table: 'users_inventory',

    async create(userID, itemID, amount = 1, prefix = '')
    {
        return new Promise(resolve => {
            db.query(`INSERT INTO ${this.table} (user_id, item_id, amount, prefix) VALUES (?,?,?,?)`, [userID, itemID, amount, prefix], (err, res) => {
                if(err) console.log(err);
                else resolve(res.insertId);
            })
        });
    },

    async getAllFor(userID)
    {
        return new Promise(resolve => {
            db.query(`
                        SELECT ui.*, it.name, it.stacks
                        FROM ${this.table} AS ui
                        INNER JOIN items AS it ON ui.item_id = it.id
                        WHERE ui.user_id = ?`,
                    [userID], (err, res) => {
                if(err) console.log(err);
                else resolve(res);
            })
        });
    },

    async getFor(userID, itemID, prefix = '')
    {
        return new Promise(resolve => {
            db.query(`SELECT * FROM ${this.table} WHERE user_id = ? AND item_id = ? AND prefix = ?`, [userID, itemID, prefix], (err, rows) => {
                if(err) console.log(err);
                else resolve(rows);
            })
        });
    },

    async add(userID, itemID, amount, prefix = '')
    {
        const item = await itemsModel.get(itemID);
        if(item.stacks) {
            const existingRecords = await this.getFor(userID, itemID, prefix);
            if(existingRecords && existingRecords.length) return this.setAmount(existingRecords[0].id, parseInt(existingRecords[0].amount) + amount);
            return this.create(userID, itemID, amount, prefix);
        }

        for(let i = 0; i < amount; i++) {
            await this.create(userID, itemID, amount, prefix);
        }
    },

    async addAmountFor(userID, itemID, amount, prefix = '')
    {
        return new Promise(resolve => {
            db.query(`UPDATE ${this.table} SET amount = ? WHERE user_id = ? AND item_id = ? AND prefix = ?`, [amount, userID, itemID, prefix], (err) => {
                if(err) console.log(err);
                else resolve(true);
            });
        });
    },

    async setAmount(id, amount)
    {
          if(amount < 1) return this.delete(id);

          amount = parseInt(amount);
          return new Promise(resolve => {
                db.query(`UPDATE ${this.table} SET amount = ? WHERE id = ?`, [amount, id], (err) => {
                    if(err) console.log(err);
                    else resolve(true);
                })
          });
    },

    async deleteFor(userID, itemID, prefix='')
    {
        return new Promise(resolve => {
            db.query(`DELETE FROM ${this.table} WHERE user_id = ? AND item_id = ? AND prefix = ?`, [userID, itemID, prefix], (err) => {
                if(err) console.log(err);
                else resolve(true);
            });
        });
    },

    async delete(id)
    {
        return new Promise(resolve => {
            db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id], (err) => {
                if(err) console.log(err);
                else resolve(true);
            });
        });
    },

    async getOccupiedSlotCount(userID)
    {
        return new Promise(resolve => {
            db.query(`SELECT COUNT(*) AS total FROM ${this.table} WHERE user_id = ?`, [userID], (err, rows) => {
                if(err) console.log(err);
                else resolve(rows[0] && !isNaN(rows[0].total) ? parseInt(rows[0].total) : 0);
            });
        });
    }
};