const { Pool } = require('pg');

class DatabaseHandler {
    constructor(host, dbname, username, password) {
        this.pool = new Pool({
            host: host,
            user: username,
            password: password,
            database: dbname,
            port: 5432, // Default PostgreSQL port
        });
    }

    async insert(table, data) {
        const keys = Object.keys(data);
        const columnNames = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const values = keys.map(key => data[key]);
        const sql = `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`;
        try {
            const result = await this.pool.query(sql, values);
            return result.rowCount > 0;
        } catch (err) {
            console.error("Database insert error:", err.message);
            return false;
        }
    }

    async is_existing(table, column, value) {
        let sql;
        let params = [];
        if (value === null) {
            sql = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} IS NULL) as exists`;
        } else {
            sql = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} = $1) as exists`;
            params = [value];
        }
        try {
            const result = await this.pool.query(sql, params);
            return result.rows[0].exists;
        } catch (err) {
            console.error("Database is_existing error:", err.message);
            return false;
        }
    }

    async authenticateUser(table, keyColumn, authColumn, keyValue, authValue) {
        const sql = `SELECT ${authColumn} FROM ${table} WHERE ${keyColumn} = $1`;
        try {
            const result = await this.pool.query(sql, [keyValue]);
            if (result.rows.length > 0) {
                if (result.rows[0][authColumn] === authValue) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                return 2;
            }
        } catch (err) {
            console.error("Database authenticateUser error:", err.message);
            return 2;
        }
    }

    async getAllRecords(tableName) {
        try {
            const result = await this.pool.query(`SELECT * FROM ${tableName}`);
            const results = result.rows;
            if (tableName === "services") {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].hasOwnProperty('features') && results[i].features) {
                        results[i].features = JSON.parse(results[i].features);
                    }
                }
            }
            return results;
        } catch (err) {
            console.error("Database getAllRecords error:", err.message);
            return [];
        }
    }

    async getAllRecordsWhere(tableName, column, value) {
        try {
            const result = await this.pool.query(`SELECT * FROM ${tableName} WHERE ${column} = $1`, [value]);
            const results = result.rows;
            if (tableName === "services") {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].hasOwnProperty('features') && results[i].features) {
                        results[i].features = JSON.parse(results[i].features);
                    }
                }
            }
            return results;
        } catch (err) {
            console.error("Database getAllRecordsWhere error:", err.message);
            return [];
        }
    }

    async getOneValue(tableName, column, whereColumn, keyvalue) {
        try {
            const sql = `SELECT ${column} FROM ${tableName} WHERE ${whereColumn} = $1 LIMIT 1`;
            const result = await this.pool.query(sql, [keyvalue]);
            return result.rows.length > 0 ? result.rows[0][column] : null;
        } catch (err) {
            console.error("Database getOneValue error:", err.message);
            return null;
        }
    }

    async update(table, data, where) {
        const setParts = [];
        const values = [];
        let idx = 1;
        for (const [column, value] of Object.entries(data)) {
            setParts.push(`${column} = $${idx++}`);
            values.push(value);
        }
        const setClause = setParts.join(', ');
        const whereParts = [];
        for (const [column, value] of Object.entries(where)) {
            whereParts.push(`${column} = $${idx++}`);
            values.push(value);
        }
        const whereClause = whereParts.join(' AND ');
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
        try {
            const result = await this.pool.query(sql, values);
            return result.rowCount > 0 ? 0 : 1;
        } catch (err) {
            console.error("Database update error:", err.message);
            return 1;
        }
    }

    async deleteById(table, id) {
        try {
            const result = await this.pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
            return result.rowCount > 0 ? 0 : 1;
        } catch (err) {
            console.error("Database deleteById error:", err.message);
            return 1;
        }
    }

    async deleteByString(table, column, value) {
        try {
            const result = await this.pool.query(`DELETE FROM ${table} WHERE ${column} = $1`, [value]);
            return result.rowCount > 0 ? 0 : 1;
        } catch (err) {
            console.error("Database deleteByString error:", err.message);
            return 1;
        }
    }
}

module.exports = DatabaseHandler;