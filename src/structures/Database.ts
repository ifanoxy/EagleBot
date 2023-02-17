import { Sequelize, DataTypes, QueryOptions } from "sequelize";
import {EagleClient} from "./Client"
export class EagleDatabaseMysql extends Sequelize {
    Datatypes: typeof DataTypes;
    constructor(EagleClient: EagleClient) {
        super(
            EagleClient.config.database.name,
            EagleClient.config.database.username,
            EagleClient.config.database.password,
            {
                dialect: "mysql",
                logging: false,
                define: {
                    charset: "utf8mb4",
                    collate: "utf8mb4_general_ci",
                    timestamps: false,
                    freezeTableName: true,
                }
            }
        );
        this.Datatypes = DataTypes;
    }

    auth(options: QueryOptions) {
        return new Promise((resolve, reject) => {
            try {
                super.authenticate(options).then(resolve).catch(reject);
            } catch (err) {
                reject(err)
            }
        })
    }
}

export class EagleDatabaseSqlite extends Sequelize {
    DataTypes: typeof DataTypes;
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./Database/main.sqlite",
            logging: false
        });
        this.DataTypes = DataTypes;
    }

    auth(options?: QueryOptions) {
        return new Promise((resolve, reject) => {
            try {
                super.authenticate(options).then(resolve).catch(reject);
            } catch (err) {
                reject(err)
            }
        })
    }
}