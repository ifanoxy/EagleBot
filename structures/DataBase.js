const { Sequelize, DataTypes } = require("sequelize");

class EagleDatabaseMysql extends Sequelize {
    constructor(Eagle) {
        super(
            Eagle.config.database.name,
            Eagle.config.database.username,
            Eagle.config.database.password,
            {
                dialect: "mysql",
                logging: true,
                define: {
                    charset: "utf8mb4",
                    collate: "utf8mb4_general_ci",
                    timestamps: false,
                    freezeTableName: true,
                }
            }
        );
        this.DataTypes = DataTypes;
    }

    auth(options) {
        return new Promise((resolve, reject) => {
            try {
                super.authenticate(options).then(resolve).catch(reject);
            } catch (err) {
                reject(err)
            }
        })
    }
}

class EagleDatabaseSqlite extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./Database/main.sqlite",
            logging: false
        });
        this.DataTypes = DataTypes;
    }

    auth(options) {
        return new Promise((resolve, reject) => {
            try {
                super.authenticate(options).then(resolve).catch(reject);
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = { EagleDatabaseMysql, EagleDatabaseSqlite }
