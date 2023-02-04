module.exports = function (database, modelName, config) {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "guildId",
                type: DataTypes.STRING(25),
                allowNull: false,
                primaryKey: true,
                isWhere: true
            },
            {
                name: 'status',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {
                    "anti-bot": {
                        status: false,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-massChannel": {
                        create: {
                            status: false,
                            frequence: null,
                            ignoreWhitelist: false,
                            sanction: null,
                        },
                        delete: {
                            status: false,
                            frequence: null,
                            ignoreWhitelist: false,
                            sanction: null,
                        },
                        update: {
                            status: false,
                            frequence: null,
                            ignoreWhitelist: false,
                            sanction: null,
                        },
                    },
                    "anti-massRole":{
                        status: false,
                        frequence: null,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-massBan":{
                        status: false,
                        frequence: null,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-massUnban":{
                        status: false,
                        frequence: null,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-massKick":{
                        status: false,
                        frequence: null,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-massSticker":{
                        status: false,
                        frequence: null,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-massEmoji":{
                        status: false,
                        frequence: null,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-newAccount":{
                        status: false,
                        ageMin: null,
                    },
                    "anti-webhook":{
                        status: false,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                    "anti-roleAdmin":{
                        status: false,
                        ignoreWhitelist: false,
                        sanction: null,
                    },
                },
            },
            {
                name: 'log',
                type: DataTypes.STRING(25),
                allowNull: true,
                isValue: true,
            }
        ]
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
            }).sync({alter: true}).then(() => {
                resolve(data);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }

    })
}