"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");
exports.default = {
    data: new SlashCommandBuilder()
        .setName("protect")
        .setDescription("Vous permet de gérer vos protections")
        .addSubcommandGroup(subGroup => subGroup
        .setName("log")
        .setDescription("Channel où sera envoyer les alertes de protection")
        .addSubcommand(sub => sub.setName("set").setDescription("Permet de définir le channel des logs")
        .addChannelOption(opt => opt.setName("channel").setDescription("le channel où seront envoyés les alertes").addChannelTypes(ChannelType.GuildText).setRequired(true)))
        .addSubcommand(sub => sub.setName("remove").setDescription('Permet de retirer le channel des logs')))
        .addSubcommand(sub => sub
        .setName('list')
        .setDescription("Vous permet de voir la liste des protections de votre serveur"))
        .addSubcommand(sub => sub
        .setName("max")
        .setDescription("Permet d'activer tout les protections au maximum"))
        .addSubcommand(sub => sub
        .setName("remove")
        .setDescription("Permet d'activer tout les protections au maximum"))
        .addSubcommand(sub => sub
        .setName("set-all")
        .setDescription("Définir toute les options de l'anti raid d'un coups")
        .addStringOption(opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui banni trop de personne").setRequired(true).addChoices({ name: "Derank", value: "derank" }, { name: "kick", value: "kick" }, { name: "ban", value: "ban" }))
        .addBooleanOption(opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true))
        .addStringOption(opt => opt.setName("frequence").setDescription("l'intervale de temps entre les bannissement. ex: '5/15s' ").setRequired(true))
        .addStringOption(opt => opt.setName('temps-minimum').setDescription("Le temps minimum de création du compte").setRequired(true))),
    execute(interaction, client) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26;
        const sub = interaction.options.getSubcommandGroup() || interaction.options.getSubcommand();
        switch (sub) {
            case "log":
                {
                    const sub = interaction.options.getSubcommand();
                    if (sub == "set") {
                        const channel = interaction.options.getChannel("channel");
                        let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
                        database.log = channel.id;
                        database.save();
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Vous venez d'ajouter un salon pour les alertes de protection")
                                    .setDescription(`les alertes de protection (ou d'anti raid) seront envoyé ici --> ${channel}`)
                                    .setColor("Blurple")
                            ]
                        });
                    }
                    else {
                        let database = client.managers.antiraidManager.getIfExist(interaction.guildId);
                        if (database) {
                            if (database.log) {
                                database.log = null;
                                database.save();
                                return interaction.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle("Vous avez retiré le channel des alertes de protection")
                                            .setColor("Blurple")
                                    ]
                                });
                            }
                        }
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Il n'y a pas de channel des alertes pour les protections")
                                    .setColor("Red")
                            ],
                            ephemeral: true
                        });
                    }
                }
                break;
            case "list":
                {
                    const database = client.managers.antiraidManager.getIfExist(interaction.guildId);
                    const embed = new EmbedBuilder()
                        .setColor("White")
                        .setTitle(`Les des protections du serveur ${interaction.guild.name}`)
                        .setDescription(`
                Logs des messages d'alerte : ${(database === null || database === void 0 ? void 0 : database.log) ? `<#${database.log}>` : "❌ `Inactif`"}\n
                `)
                        .setFields({
                        name: "Anti Bot",
                        value: `Status : ${(database === null || database === void 0 ? void 0 : database.status["anti-bot"].status) ? ("✅ `Actif` --> Whitelist: " + ((database === null || database === void 0 ? void 0 : database.status["anti-bot"].ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database === null || database === void 0 ? void 0 : database.status["anti-bot"].sanction}\``) : "❌ `Inactif`"}`
                    }, {
                        name: "Anti Mass Channel",
                        value: `
                        __Channel Create__ :  Status : ${((_a = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["create"]) === null || _a === void 0 ? void 0 : _a.status) ? ("✅ `Actif` --> Whitelist: " + (((_b = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["create"]) === null || _b === void 0 ? void 0 : _b.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_c = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["create"]) === null || _c === void 0 ? void 0 : _c.frequence}\`` + ", Sanction: " + `\`${(_d = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["create"]) === null || _d === void 0 ? void 0 : _d.sanction}\``) : "❌ `Inactif`"}
                        __Channel Update__ :  Status : ${((_e = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["update"]) === null || _e === void 0 ? void 0 : _e.status) ? ("✅ `Actif` --> Whitelist: " + (((_f = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["update"]) === null || _f === void 0 ? void 0 : _f.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_g = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["update"]) === null || _g === void 0 ? void 0 : _g.frequence}\`` + ", Sanction: " + `\`${(_h = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["update"]) === null || _h === void 0 ? void 0 : _h.sanction}\``) : "❌ `Inactif`"}
                        __Channel Delete__ :  Status : ${((_j = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["delete"]) === null || _j === void 0 ? void 0 : _j.status) ? ("✅ `Actif` --> Whitelist: " + (((_k = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["delete"]) === null || _k === void 0 ? void 0 : _k.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_l = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["delete"]) === null || _l === void 0 ? void 0 : _l.frequence}\`` + ", Sanction: " + `\`${(_m = database === null || database === void 0 ? void 0 : database.status["anti-massChannel"]["delete"]) === null || _m === void 0 ? void 0 : _m.sanction}\``) : "❌ `Inactif`"}
                        `
                    }, {
                        name: "Anti Mass Role",
                        value: `
                        __Role Create__ :  Status : ${((_o = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["create"]) === null || _o === void 0 ? void 0 : _o.status) ? ("✅ `Actif` --> Whitelist: " + (((_p = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["create"]) === null || _p === void 0 ? void 0 : _p.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_q = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["create"]) === null || _q === void 0 ? void 0 : _q.frequence}\`` + ", Sanction: " + `\`${(_r = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["create"]) === null || _r === void 0 ? void 0 : _r.sanction}\``) : "❌ `Inactif`"}
                        __Role Update__ :  Status : ${((_s = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["update"]) === null || _s === void 0 ? void 0 : _s.status) ? ("✅ `Actif` --> Whitelist: " + (((_t = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["update"]) === null || _t === void 0 ? void 0 : _t.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_u = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["update"]) === null || _u === void 0 ? void 0 : _u.frequence}\`` + ", Sanction: " + `\`${(_v = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["update"]) === null || _v === void 0 ? void 0 : _v.sanction}\``) : "❌ `Inactif`"}
                        __Role Delete__ :  Status : ${((_w = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["delete"]) === null || _w === void 0 ? void 0 : _w.status) ? ("✅ `Actif` --> Whitelist: " + (((_x = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["delete"]) === null || _x === void 0 ? void 0 : _x.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_y = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["delete"]) === null || _y === void 0 ? void 0 : _y.frequence}\`` + ", Sanction: " + `\`${(_z = database === null || database === void 0 ? void 0 : database.status["anti-massRole"]["delete"]) === null || _z === void 0 ? void 0 : _z.sanction}\``) : "❌ `Inactif`"}
                        `
                    }, {
                        name: "Anti Mass Sticker",
                        value: `
                        __Sticker Create__ :  Status : ${((_0 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["create"]) === null || _0 === void 0 ? void 0 : _0.status) ? ("✅ `Actif` --> Whitelist: " + (((_1 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["create"]) === null || _1 === void 0 ? void 0 : _1.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_2 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["create"]) === null || _2 === void 0 ? void 0 : _2.frequence}\`` + ", Sanction: " + `\`${(_3 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["create"]) === null || _3 === void 0 ? void 0 : _3.sanction}\``) : "❌ `Inactif`"}
                        __Sticker Update__ :  Status : ${((_4 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["update"]) === null || _4 === void 0 ? void 0 : _4.status) ? ("✅ `Actif` --> Whitelist: " + (((_5 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["update"]) === null || _5 === void 0 ? void 0 : _5.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_6 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["update"]) === null || _6 === void 0 ? void 0 : _6.frequence}\`` + ", Sanction: " + `\`${(_7 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["update"]) === null || _7 === void 0 ? void 0 : _7.sanction}\``) : "❌ `Inactif`"}
                        __Sticker Delete__ :  Status : ${((_8 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["delete"]) === null || _8 === void 0 ? void 0 : _8.status) ? ("✅ `Actif` --> Whitelist: " + (((_9 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["delete"]) === null || _9 === void 0 ? void 0 : _9.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_10 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["delete"]) === null || _10 === void 0 ? void 0 : _10.frequence}\`` + ", Sanction: " + `\`${(_11 = database === null || database === void 0 ? void 0 : database.status["anti-massSticker"]["delete"]) === null || _11 === void 0 ? void 0 : _11.sanction}\``) : "❌ `Inactif`"}
                        `
                    }, {
                        name: "Anti Mass Emoji",
                        value: `
                        __Emoji Create__ :  Status : ${((_12 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["create"]) === null || _12 === void 0 ? void 0 : _12.status) ? ("✅ `Actif` --> Whitelist: " + (((_13 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["create"]) === null || _13 === void 0 ? void 0 : _13.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_14 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["create"]) === null || _14 === void 0 ? void 0 : _14.frequence}\`` + ", Sanction: " + `\`${(_15 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["create"]) === null || _15 === void 0 ? void 0 : _15.sanction}\``) : "❌ `Inactif`"}
                        __Emoji Update__ :  Status : ${((_16 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["update"]) === null || _16 === void 0 ? void 0 : _16.status) ? ("✅ `Actif` --> Whitelist: " + (((_17 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["update"]) === null || _17 === void 0 ? void 0 : _17.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_18 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["update"]) === null || _18 === void 0 ? void 0 : _18.frequence}\`` + ", Sanction: " + `\`${(_19 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["update"]) === null || _19 === void 0 ? void 0 : _19.sanction}\``) : "❌ `Inactif`"}
                        __Emoji Delete__ :  Status : ${((_20 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["delete"]) === null || _20 === void 0 ? void 0 : _20.status) ? ("✅ `Actif` --> Whitelist: " + (((_21 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["delete"]) === null || _21 === void 0 ? void 0 : _21.ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_22 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["delete"]) === null || _22 === void 0 ? void 0 : _22.frequence}\`` + ", Sanction: " + `\`${(_23 = database === null || database === void 0 ? void 0 : database.status["anti-massEmoji"]["delete"]) === null || _23 === void 0 ? void 0 : _23.sanction}\``) : "❌ `Inactif`"}
                        `
                    }, {
                        name: "Anti Webhook",
                        value: `Status : ${(database === null || database === void 0 ? void 0 : database.status["anti-webhook"].status) ? ("✅ `Actif` --> Whitelist: " + ((database === null || database === void 0 ? void 0 : database.status["anti-webhook"].ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database === null || database === void 0 ? void 0 : database.status["anti-webhook"].sanction}\``) : "❌ `Inactif`"}`
                    }, {
                        name: "Anti new Account",
                        value: `Status : ${(database === null || database === void 0 ? void 0 : database.status["anti-newAccount"].status) ? ("✅ `Actif` --> temps minimum: `" + (database === null || database === void 0 ? void 0 : database.status["anti-newAccount"].ageMin)) + "`" : "❌ `Inactif`"}`
                    }, {
                        name: "Anti Role Administrateur",
                        value: `Status : ${(database === null || database === void 0 ? void 0 : database.status["anti-roleAdmin"].status) ? ("✅ `Actif` --> Whitelist: " + ((database === null || database === void 0 ? void 0 : database.status["anti-roleAdmin"].ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database === null || database === void 0 ? void 0 : database.status["anti-roleAdmin"].sanction}\``) : "❌ `Inactif`"}`
                    }, {
                        name: "Anti mass Kick",
                        value: `Status : ${(database === null || database === void 0 ? void 0 : database.status["anti-massKick"].status) ? ("✅ `Actif` --> Whitelist: " + ((database === null || database === void 0 ? void 0 : database.status["anti-massKick"].ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_24 = database === null || database === void 0 ? void 0 : database.status["anti-massKick"]) === null || _24 === void 0 ? void 0 : _24.frequence}\`` + ", Sanction: " + `\`${database === null || database === void 0 ? void 0 : database.status["anti-massKick"].sanction}\``) : "❌ `Inactif`"}`
                    }, {
                        name: "Anti mass Ban",
                        value: `Status : ${(database === null || database === void 0 ? void 0 : database.status["anti-massBan"].status) ? ("✅ `Actif` --> Whitelist: " + ((database === null || database === void 0 ? void 0 : database.status["anti-massBan"].ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_25 = database === null || database === void 0 ? void 0 : database.status["anti-massBan"]) === null || _25 === void 0 ? void 0 : _25.frequence}\`` + ", Sanction: " + `\`${database === null || database === void 0 ? void 0 : database.status["anti-massBan"].sanction}\``) : "❌ `Inactif`"}`
                    }, {
                        name: "Anti mass Unban",
                        value: `Status : ${(database === null || database === void 0 ? void 0 : database.status["anti-massUnban"].status) ? ("✅ `Actif` --> Whitelist: " + ((database === null || database === void 0 ? void 0 : database.status["anti-massUnban"].ignoreWhitelist) ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${(_26 = database === null || database === void 0 ? void 0 : database.status["anti-massUnban"]) === null || _26 === void 0 ? void 0 : _26.frequence}\`` + ", Sanction: " + `\`${database === null || database === void 0 ? void 0 : database.status["anti-massUnban"].sanction}\``) : "❌ `Inactif`"}`
                    });
                    interaction.reply({
                        embeds: [embed]
                    });
                }
                break;
            case "max":
                {
                    let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
                    database.status = {
                        "anti-bot": {
                            status: true,
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-massChannel": {
                            create: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-massRole": {
                            create: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-massBan": {
                            status: true,
                            frequence: "5/15s",
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-massUnban": {
                            status: true,
                            frequence: "5/15s",
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-massKick": {
                            status: true,
                            frequence: "5/15s",
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-massSticker": {
                            create: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-massEmoji": {
                            create: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: true,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-newAccount": {
                            status: true,
                            ageMin: "7d",
                        },
                        "anti-webhook": {
                            status: true,
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-roleAdmin": {
                            status: true,
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                    };
                    database.save();
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous avez activés toutes les protections au niveaux maximum !")
                                .setColor("Red")
                        ],
                        ephemeral: true
                    });
                    if (database.log) {
                        const channel = interaction.guild.channels.cache.get(database.log);
                        if (!channel)
                            return database.log = null;
                        // @ts-ignore
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#2f3136")
                                    .setAuthor({ name: "Protect Logs" })
                                    .setTitle(`Activation de toutes les protections aux maximum effectuée`)
                                    .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                                    .setThumbnail("https://img.icons8.com/stickers/128/checked-2.png")
                                    .setTimestamp()
                            ]
                        });
                    }
                }
                break;
            case "remove":
                {
                    let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
                    database.status = {
                        "anti-bot": {
                            status: false,
                            ignoreWhitelist: null,
                            sanction: null,
                        },
                        "anti-massChannel": {
                            create: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-massRole": {
                            create: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-massBan": {
                            status: false,
                            frequence: "5/15s",
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-massUnban": {
                            status: false,
                            frequence: "5/15s",
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-massKick": {
                            status: false,
                            frequence: "5/15s",
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-massSticker": {
                            create: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-massEmoji": {
                            create: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            delete: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                            update: {
                                status: false,
                                frequence: "5/15s",
                                ignoreWhitelist: false,
                                sanction: "ban",
                            },
                        },
                        "anti-newAccount": {
                            status: false,
                            ageMin: "7d",
                        },
                        "anti-webhook": {
                            status: false,
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                        "anti-roleAdmin": {
                            status: false,
                            ignoreWhitelist: false,
                            sanction: "ban",
                        },
                    };
                    database.save();
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous avez désactivés toutes les protections !")
                                .setColor("Red")
                        ],
                        ephemeral: true
                    });
                    if (database.log) {
                        const channel = interaction.guild.channels.cache.get(database.log);
                        if (!channel)
                            return database.log = null;
                        // @ts-ignore
                        channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setAuthor({ name: "Protect Logs" })
                                    .setTitle(`Désactivation de toutes les protections effectuée !`)
                                    .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                                    .setTimestamp()
                            ]
                        });
                    }
                }
                break;
            case "set-all": {
                const frequence = interaction.options.getString("frequence");
                const sanction = interaction.options.getString("sanction");
                const ignoreWhitelist = interaction.options.getBoolean("ignore-whitelist");
                const ageMin = interaction.options.getString("temps-minimum");
                if (!client.func.utils.checkFrequence(frequence, "x/yt"))
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setTitle("Il y a une erreur dans la fréquence !")
                                .setDescription(`
                        la fréqence doit ressemblée à ceci:
                        
                        **x/ys**
                        x = nombre de channel
                        y = nombre de seconde
                        s = seconde

                        __exemple :__
                        5/15s --> *(5 channels en 15 secondes)*
                        `)
                        ],
                        ephemeral: true
                    });
                let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
                database.status = {
                    "anti-bot": {
                        status: true,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-massChannel": {
                        create: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        delete: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        update: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                    },
                    "anti-massRole": {
                        create: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        delete: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        update: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                    },
                    "anti-massBan": {
                        status: true,
                        frequence: frequence,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-massUnban": {
                        status: true,
                        frequence: frequence,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-massKick": {
                        status: true,
                        frequence: frequence,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-massSticker": {
                        create: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        delete: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        update: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                    },
                    "anti-massEmoji": {
                        create: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        delete: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                        update: {
                            status: true,
                            frequence: frequence,
                            ignoreWhitelist: ignoreWhitelist,
                            sanction: sanction,
                        },
                    },
                    "anti-newAccount": {
                        status: true,
                        ageMin: ageMin,
                    },
                    "anti-webhook": {
                        status: true,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-roleAdmin": {
                        status: true,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                };
                database.save();
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Vous avez modifiés toutes les protections !")
                            .setDescription(`
                        status : \`Actif\`,
                        ignoreWhitelist : \`${ignoreWhitelist}\`
                        sanction : \`${sanction}\`
                        temps minimum : \`${ageMin}\`
                        `)
                            .setColor("Orange")
                    ],
                    ephemeral: true
                });
                if (database.log) {
                    const channel = interaction.guild.channels.cache.get(database.log);
                    if (!channel)
                        return database.log = null;
                    // @ts-ignore
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Orange")
                                .setAuthor({ name: "Protect Logs" })
                                .setTitle(`Changement de toute les protections !`)
                                .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                                .setTimestamp()
                        ]
                    });
                }
            }
        }
    }
};
