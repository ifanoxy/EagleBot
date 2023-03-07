"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(database, modelName) {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "userId",
                type: DataTypes.STRING(25),
                allowNull: false,
                isWhere: true,
                primaryKey: true
            },
            {
                name: `authorId`,
                type: DataTypes.STRING(25),
                allowNull: false,
                isValue: true
            },
            {
                name: `reason`,
                type: DataTypes.TEXT,
                allowNull: false,
                isValue: true,
                default: `pas de raison`
            }
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
