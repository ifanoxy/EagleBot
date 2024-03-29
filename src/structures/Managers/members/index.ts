export default function (database, modelName): Promise<Array<{name: string, type: any, allowNull?: boolean, isValue?: boolean, isWhere?: boolean, primaryKey?: boolean, default?: any}>> {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "memberId",
                type: DataTypes.STRING(25),
                allowNull: false,
                isWhere: true,
                primaryKey: true,
            },
            {
                name: 'moderation',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {
                    kick: 0,
                    ban: 0,
                    removedMessage: 0,
                    warn: 0,
                    mute: 0
                }
            },
            {
                name: 'warn',
                type: DataTypes.JSON,
                isValue: true,
                default: []
            },
            {
                name: 'embeds',
                type: DataTypes.JSON,
                isValue: true,
                default: {}
            },
            {
                name: 'vote',
                type: DataTypes.INTEGER,
                isValue: true,
                default: 0
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
                charset: "utf8mb4",
                collate: "utf8mb4_unicode_ci",
            })
                .sync({alter: true}).then(() => {
                resolve(data);
            }).catch(reject);
        } catch (err) {
            reject(err);
        }
    })
}