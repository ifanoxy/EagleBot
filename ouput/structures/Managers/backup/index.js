"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(database, modelName) {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "id",
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            {
                name: "userId",
                type: DataTypes.STRING(25),
                allowNull: false,
                isWhere: true,
            },
            {
                name: 'name',
                type: DataTypes.STRING(25),
                allowNull: false,
                isWhere: true,
            }, {
                name: 'guild',
                type: DataTypes.JSON,
                isValue: true,
                allowNull: false,
            },
            {
                name: 'channels',
                type: DataTypes.JSON,
                isValue: true,
                allowNull: true,
            },
            {
                name: 'roles',
                type: DataTypes.JSON,
                isValue: true,
                allowNull: true,
            },
            {
                name: 'emojis',
                type: DataTypes.JSON,
                isValue: true,
                allowNull: true,
            },
            {
                name: 'stickers',
                type: DataTypes.JSON,
                isValue: true,
                allowNull: true,
            },
            {
                name: 'bans',
                type: DataTypes.JSON,
                isValue: true,
                allowNull: true,
            },
        ];
        const t = {};
        data.forEach(y => {
            t[y.name] = y;
        });
        try {
            database.define(modelName, t, {
                timestamps: false,
                tableName: modelName,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }).sync({ alter: true }).then(() => {
                resolve(data);
            }).catch(reject);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.default = default_1;
