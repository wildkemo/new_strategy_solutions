const mysql = require('mysql2/promise');

class DatabaseHandler {
    constructor(host, dbname, username, password) {
        this.connection = null;
        this.connect(host, dbname, username, password).catch(err => {
            console.error("Database connection error:", err.message);
            throw new Error("Failed to connect to the database.");
        });
    }

    async connect(host, dbname, username, password) {
        this.connection = await mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database: dbname,
            charset: 'utf8mb4'
        });
        this.connection.on('error', err => {
            console.error("Database connection error:", err.message);
        });
    }

    async insert(table, data) {
        const keys = Object.keys(data);
        const columnNames = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(key => data[key]);
        const sql = `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`;
        try {
            const [result] = await this.connection.execute(sql, values);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Database insert error:", err.message);
            return false;
        }
    }

    async is_existing(table, column, value) {
        let sql;
        let params = [];
        if (value === null) {
            sql = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} IS NULL)`;
        } else {
            sql = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} = ?)`;
            params = [value];
        }
        try {
            const [result] = await this.connection.execute(sql, params);
            return result[0][0] === 1;
        } catch (err) {
            console.error("Database is_existing error:", err.message);
            return false;
        }
    }

    async authenticateUser(table, keyColumn, authColumn, keyValue, authValue) {
        const sql = `SELECT ${authColumn} FROM ${table} WHERE ${keyColumn} = ?`;
        const [result] = await this.connection.execute(sql, [keyValue]);
        if (result.length > 0) {
            if (result[0][authColumn] === authValue) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 2;
        }
    }

    async getAllRecords(tableName) {
        try {
            const [results] = await this.connection.execute(`SELECT * FROM ${tableName}`);
            if (tableName === "services") {
                // Convert JSON features to PHP arrays
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
            const [results] = await this.connection.execute(`SELECT * FROM ${tableName} WHERE ${column} = ?`, [value]);
            if (tableName === "services") {
                // Convert JSON features to PHP arrays
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
            const [result] = await this.connection.execute(`SELECT ${column} FROM ${tableName} WHERE ${whereColumn} = ? LIMIT 1`, [keyvalue]);
            return result.length > 0 ? result[0][column] : null;
        } catch (err) {
            console.error("Database getOneValue error:", err.message);
            return null;
        }
    }

    async update(table, data, where) {
        const setParts = [];
        const setValues = {};
        for (const [column, value] of Object.entries(data)) {
            setParts.push(`${column} = ?`);
            setValues[`set_${column}`] = value;
        }
        const setClause = setParts.join(', ');
        const whereParts = [];
        const whereValues = {};
        for (const [column, value] of Object.entries(where)) {
            whereParts.push(`${column} = ?`);
            whereValues[`where_${column}`] = value;
        }
        const whereClause = whereParts.join(' AND ');
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
        const params = { ...setValues, ...whereValues };
        try {
            const [result] = await this.connection.execute(sql, Object.values(params));
            return result.affectedRows > 0 ? 0 : 1;
        } catch (err) {
            console.error("Database update error:", err.message);
            return 1;
        }
    }

    async deleteById(table, id) {
        try {
            const [result] = await this.connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
            return result.affectedRows > 0 ? 0 : 1;
        } catch (err) {
            console.error("Database deleteById error:", err.message);
            return 1;
        }
    }

    async deleteByString(table, column, value) {
        try {
            const [result] = await this.connection.execute(`DELETE FROM ${table} WHERE ${column} = ?`, [value]);
            return result.affectedRows > 0 ? 0 : 1;
        } catch (err) {
            console.error("Database deleteByString error:", err.message);
            return 1;
        }
    }
}

module.exports = DatabaseHandler;