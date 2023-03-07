import {ChatInputCommandInteraction} from "discord.js";
import {EagleClient} from "../../../structures/Client";

const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("protect")
        .setDescription("Vous permet de gérer vos protections")
        .addSubcommandGroup(
            subGroup => subGroup
                .setName("log")
                .setDescription("Channel où sera envoyer les alertes de protection")
                .addSubcommand(
                    sub => sub.setName("set").setDescription("Permet de définir le channel des logs")
                        .addChannelOption(
                            opt => opt.setName("channel").setDescription("le channel où seront envoyés les alertes").addChannelTypes(ChannelType.GuildText).setRequired(true)
                        )
                )
                .addSubcommand(
                    sub => sub.setName("remove").setDescription('Permet de retirer le channel des logs')
                )
        )
        .addSubcommand(
            sub => sub
                .setName('list')
                .setDescription("Vous permet de voir la liste des protections de votre serveur")
        )
        .addSubcommand(
            sub => sub
                .setName("max")
                .setDescription("Permet d'activer tout les protections au maximum")
        )
        .addSubcommand(
            sub => sub
                .setName("remove")
                .setDescription("Permet d'activer tout les protections au maximum")
        )
        .addSubcommand(
            sub => sub
                .setName("set-all")
                .setDescription("Définir toute les options de l'anti raid d'un coups")
                .addStringOption(
                    opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui banni trop de personne").setRequired(true).addChoices(
                        {name: "Derank", value: "derank"},
                        {name: "kick", value: "kick"},
                        {name: "ban", value: "ban"}
                    )
                )
                .addBooleanOption(
                    opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                )
                .addStringOption(
                    opt => opt.setName("frequence").setDescription("l'intervale de temps entre les bannissement. ex: '5/15s' ").setRequired(true)
                )
                .addStringOption(
                    opt => opt.setName('temps-minimum').setDescription("Le temps minimum de création du compte").setRequired(true)
                )
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const sub = interaction.options.getSubcommandGroup() || interaction.options.getSubcommand();

        switch (sub) {
            case "log" : {
                const sub = interaction.options.getSubcommand();
                if (sub == "set") {
                    const channel = interaction.options.getChannel("channel");
                    let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId});
                    database.log = channel.id;
                    database.save();
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous venez d'ajouter un salon pour les alertes de protection")
                                .setDescription(`les alertes de protection (ou d'anti raid) seront envoyé ici --> ${channel}`)
                                .setColor("Blurple")
                        ]
                    })
                } else {
                    let database = client.managers.antiraidManager.getIfExist(interaction.guildId);
                    if (database) {
                        if (database.log) {
                            database.log =  null
                            database.save()
                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("Vous avez retiré le channel des alertes de protection")
                                        .setColor("Blurple")
                                ]
                            })
                        }
                    }

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Il n'y a pas de channel des alertes pour les protections")
                                .setColor("Red")
                        ],
                        ephemeral: true
                    })
                }
            }break;
            case "list" : {
                const database = client.managers.antiraidManager.getIfExist(interaction.guildId);

                const embed = new EmbedBuilder()
                    .setColor("White")
                    .setTitle(`Les des protections du serveur ${interaction.guild.name}`)
                    .setDescription(`
                Logs des messages d'alerte : ${database?.log ? `<#${database.log}>` : "❌ `Inactif`"}\n
                `)
                    .setFields(
                        {
                            name: "Anti Bot",
                            value: `Status : ${database?.status["anti-bot"].status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-bot"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database?.status["anti-bot"].sanction}\``) : "❌ `Inactif`"}`
                        },
                        {
                            name: "Anti Mass Channel",
                            value: `
                        __Channel Create__ :  Status : ${database?.status["anti-massChannel"]["create"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massChannel"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massChannel"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massChannel"]["create"]?.sanction}\``) : "❌ `Inactif`"}
                        __Channel Update__ :  Status : ${database?.status["anti-massChannel"]["update"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massChannel"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massChannel"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massChannel"]["update"]?.sanction}\``) : "❌ `Inactif`"}
                        __Channel Delete__ :  Status : ${database?.status["anti-massChannel"]["delete"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massChannel"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massChannel"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massChannel"]["delete"]?.sanction}\``) : "❌ `Inactif`"}
                        `
                        },
                        {
                            name: "Anti Mass Role",
                            value: `
                        __Role Create__ :  Status : ${database?.status["anti-massRole"]["create"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massRole"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massRole"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massRole"]["create"]?.sanction}\``) : "❌ `Inactif`"}
                        __Role Update__ :  Status : ${database?.status["anti-massRole"]["update"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massRole"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massRole"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massRole"]["update"]?.sanction}\``) : "❌ `Inactif`"}
                        __Role Delete__ :  Status : ${database?.status["anti-massRole"]["delete"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massRole"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massRole"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massRole"]["delete"]?.sanction}\``) : "❌ `Inactif`"}
                        `
                        },
                        {
                            name: "Anti Mass Sticker",
                            value: `
                        __Sticker Create__ :  Status : ${database?.status["anti-massSticker"]["create"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massSticker"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massSticker"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massSticker"]["create"]?.sanction}\``) : "❌ `Inactif`"}
                        __Sticker Update__ :  Status : ${database?.status["anti-massSticker"]["update"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massSticker"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massSticker"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massSticker"]["update"]?.sanction}\``) : "❌ `Inactif`"}
                        __Sticker Delete__ :  Status : ${database?.status["anti-massSticker"]["delete"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massSticker"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massSticker"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massSticker"]["delete"]?.sanction}\``) : "❌ `Inactif`"}
                        `
                        },
                        {
                            name: "Anti Mass Emoji",
                            value: `
                        __Emoji Create__ :  Status : ${database?.status["anti-massEmoji"]["create"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massEmoji"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massEmoji"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massEmoji"]["create"]?.sanction}\``) : "❌ `Inactif`"}
                        __Emoji Update__ :  Status : ${database?.status["anti-massEmoji"]["update"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massEmoji"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massEmoji"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massEmoji"]["update"]?.sanction}\``) : "❌ `Inactif`"}
                        __Emoji Delete__ :  Status : ${database?.status["anti-massEmoji"]["delete"]?.status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massEmoji"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massEmoji"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massEmoji"]["delete"]?.sanction}\``) : "❌ `Inactif`"}
                        `
                        },
                        {
                            name: "Anti Webhook",
                            value: `Status : ${database?.status["anti-webhook"].status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-webhook"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database?.status["anti-webhook"].sanction}\``) : "❌ `Inactif`"}`
                        },
                        {
                            name: "Anti new Account",
                            value: `Status : ${database?.status["anti-newAccount"].status ? ("✅ `Actif` --> temps minimum: `" + database?.status["anti-newAccount"].ageMin)+ "`" :"❌ `Inactif`"}`
                        },
                        {
                            name: "Anti Role Administrateur",
                            value: `Status : ${database?.status["anti-roleAdmin"].status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-roleAdmin"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database?.status["anti-roleAdmin"].sanction}\``) : "❌ `Inactif`"}`
                        },
                        {
                            name: "Anti mass Kick",
                            value: `Status : ${database?.status["anti-massKick"].status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massKick"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massKick"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massKick"].sanction}\``) : "❌ `Inactif`"}`
                        },
                        {
                            name: "Anti mass Ban",
                            value: `Status : ${database?.status["anti-massBan"].status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massBan"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massBan"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massBan"].sanction}\``) : "❌ `Inactif`"}`
                        },
                        {
                            name: "Anti mass Unban",
                            value: `Status : ${database?.status["anti-massUnban"].status ? ("✅ `Actif` --> Whitelist: " + (database?.status["anti-massUnban"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massUnban"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massUnban"].sanction}\``) : "❌ `Inactif`"}`
                        },
                    )

                interaction.reply({
                    embeds: [embed]
                })
            }break;
            case "max" : {
                let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId});

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
                    "anti-massRole":{
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
                    "anti-massBan":{
                        status: true,
                        frequence: "5/15s",
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-massUnban":{
                        status: true,
                        frequence: "5/15s",
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-massKick":{
                        status: true,
                        frequence: "5/15s",
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-massSticker":{
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
                    "anti-massEmoji":{
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
                    "anti-newAccount":{
                        status: true,
                        ageMin: "7d",
                    },
                    "anti-webhook":{
                        status: true,
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-roleAdmin":{
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
                    if (!channel) return database.log = null;
                    // @ts-ignore
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#2f3136")
                                .setAuthor({name: "Protect Logs"})
                                .setTitle(`Activation de toutes les protections aux maximum effectuée`)
                                .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                                .setThumbnail("https://img.icons8.com/stickers/128/checked-2.png")
                                .setTimestamp()
                        ]
                    })
                }
            }break;
            case "remove" : {
                let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId});

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
                    "anti-massRole":{
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
                    "anti-massBan":{
                        status: false,
                        frequence: "5/15s",
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-massUnban":{
                        status: false,
                        frequence: "5/15s",
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-massKick":{
                        status: false,
                        frequence: "5/15s",
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-massSticker":{
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
                    "anti-massEmoji":{
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
                    "anti-newAccount":{
                        status: false,
                        ageMin: "7d",
                    },
                    "anti-webhook":{
                        status: false,
                        ignoreWhitelist: false,
                        sanction: "ban",
                    },
                    "anti-roleAdmin":{
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
                    if (!channel) return database.log = null;
                    // @ts-ignore
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setAuthor({name: "Protect Logs"})
                                .setTitle(`Désactivation de toutes les protections effectuée !`)
                                .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                                .setTimestamp()
                        ]
                    })
                }
            }break;
            case "set-all" : {
                const frequence = interaction.options.getString("frequence");
                const sanction = interaction.options.getString("sanction");
                const ignoreWhitelist = interaction.options.getBoolean("ignore-whitelist");
                const ageMin = interaction.options.getString("temps-minimum");
                if (!client.func.utils.checkFrequence(frequence, "x/yt")) return interaction.reply({
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

                let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId});

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
                    "anti-massRole":{
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
                    "anti-massBan":{
                        status: true,
                        frequence: frequence,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-massUnban":{
                        status: true,
                        frequence: frequence,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-massKick":{
                        status: true,
                        frequence: frequence,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-massSticker":{
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
                    "anti-massEmoji":{
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
                    "anti-newAccount":{
                        status: true,
                        ageMin: ageMin,
                    },
                    "anti-webhook":{
                        status: true,
                        ignoreWhitelist: ignoreWhitelist,
                        sanction: sanction,
                    },
                    "anti-roleAdmin":{
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
                    if (!channel) return database.log = null;
                    // @ts-ignore
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Orange")
                                .setAuthor({name: "Protect Logs"})
                                .setTitle(`Changement de toute les protections !`)
                                .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                                .setTimestamp()
                        ]
                    })
                }
            }
        }
    }
}