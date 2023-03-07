"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EagleDatabaseSqlite = exports.EagleDatabaseMysql = void 0;
const sequelize_1 = require("sequelize");
class EagleDatabaseMysql extends sequelize_1.Sequelize {
    constructor(EagleClient) {
        super(EagleClient.config.database.name, EagleClient.config.database.username, EagleClient.config.database.password, {
            host: EagleClient.config.database.host,
            dialect: "mysql",
            logging: false,
            define: {
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                timestamps: false,
                freezeTableName: true,
            }
        });
        this.DataTypes = sequelize_1.DataTypes;
    }
    auth(options) {
        return new Promise((resolve, reject) => {
            try {
                super.authenticate(options).then(resolve).catch(reject);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.EagleDatabaseMysql = EagleDatabaseMysql;
class EagleDatabaseSqlite extends sequelize_1.Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./Database/main.sqlite",
            logging: false
        });
        this.DataTypes = sequelize_1.DataTypes;
    }
    auth(options) {
        return new Promise((resolve, reject) => {
            try {
                super.authenticate(options).then(resolve).catch(reject);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.EagleDatabaseSqlite = EagleDatabaseSqlite;
