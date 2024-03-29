export default function (database, modelName): Promise<Array<{name: string, type: any, allowNull?: boolean, isValue?: boolean, isWhere?: boolean, primaryKey?: boolean, default?: any}>> {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "userId",
                type: DataTypes.STRING(25),
                allowNull: false,
                primaryKey: true,
                isWhere: true
            },
            {
                name: "data",
                type: DataTypes.JSON,
                allowNull: false,
                isValue: true,
                default: {}
            },
        ];


        const t = {};
        data.forEach(y => {
            t[y.name] = y;
        })


        try {
            database.define(modelName, t, {
                timestamps: false,
                tableName: modelName,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }).sync().then(() => {
                resolve(data);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }

    })
}