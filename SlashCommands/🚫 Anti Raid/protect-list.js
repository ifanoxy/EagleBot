const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('protect-list')
    .setDescription("Vous permet de voir la liste des protections de votre serveur"),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const database = client.managers.antiraidManager.getIfExist(interaction.guildId);
        
        const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle(`Les des protections du serveur ${interaction.guild.name}`)
        .setDescription(`
        Logs des messages d'alerte : ${database?.log ? `<#database?.log>` : "`Inactif`"}\n
        `)
        .setFields(
            {
                name: "Anti Bot",
                value: `Status : ${database?.status["anti-bot"].status ? ("`Actif` --> Whitelist: " + (database?.status["anti-bot"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database?.status["anti-bot"].sanction}\``) : "`Inactif`"}`
            },
            {
                name: "Anti Mass Channel",
                value: `
                __Channel Create__ :  Status : ${database?.status["anti-massChannel"]["create"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massChannel"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massChannel"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massChannel"]["create"]?.sanction}\``) : "`Inactif`"}
                __Channel Update__ :  Status : ${database?.status["anti-massChannel"]["update"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massChannel"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massChannel"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massChannel"]["update"]?.sanction}\``) : "`Inactif`"}
                __Channel Delete__ :  Status : ${database?.status["anti-massChannel"]["delete"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massChannel"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massChannel"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massChannel"]["delete"]?.sanction}\``) : "`Inactif`"}
                `
            },
            {
                name: "Anti Mass Role",
                value: `
                __Role Create__ :  Status : ${database?.status["anti-massRole"]["create"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massRole"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massRole"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massRole"]["create"]?.sanction}\``) : "`Inactif`"}
                __Role Update__ :  Status : ${database?.status["anti-massRole"]["update"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massRole"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massRole"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massRole"]["update"]?.sanction}\``) : "`Inactif`"}
                __Role Delete__ :  Status : ${database?.status["anti-massRole"]["delete"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massRole"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massRole"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massRole"]["delete"]?.sanction}\``) : "`Inactif`"}
                `
            },
            {
                name: "Anti Mass Sticker",
                value: `
                __Sticker Create__ :  Status : ${database?.status["anti-massSticker"]["create"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massSticker"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massSticker"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massSticker"]["create"]?.sanction}\``) : "`Inactif`"}
                __Sticker Update__ :  Status : ${database?.status["anti-massSticker"]["update"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massSticker"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massSticker"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massSticker"]["update"]?.sanction}\``) : "`Inactif`"}
                __Sticker Delete__ :  Status : ${database?.status["anti-massSticker"]["delete"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massSticker"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massSticker"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massSticker"]["delete"]?.sanction}\``) : "`Inactif`"}
                `
            },
            {
                name: "Anti Mass Emoji",
                value: `
                __Emoji Create__ :  Status : ${database?.status["anti-massEmoji"]["create"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massEmoji"]["create"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massEmoji"]["create"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massEmoji"]["create"]?.sanction}\``) : "`Inactif`"}
                __Emoji Update__ :  Status : ${database?.status["anti-massEmoji"]["update"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massEmoji"]["update"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massEmoji"]["update"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massEmoji"]["update"]?.sanction}\``) : "`Inactif`"}
                __Emoji Delete__ :  Status : ${database?.status["anti-massEmoji"]["delete"]?.status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massEmoji"]["delete"]?.ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massEmoji"]["delete"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massEmoji"]["delete"]?.sanction}\``) : "`Inactif`"}
                `
            },
            {
                name: "Anti Webhook",
                value: `Status : ${database?.status["anti-webhook"].status ? ("`Actif` --> Whitelist: " + (database?.status["anti-webhook"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-webhook"].frequence}\`` + ", Sanction: " + `\`${database?.status["anti-webhook"].sanction}\``) : "`Inactif`"}`
            },
            {
                name: "Anti new Account",
                value: `Status : ${database?.status["anti-newAccount"].status ? ("`Actif` --> temps minimum: " + database?.status["anti-newAccount"].ageMin) :"`Inactif`"}`
            },
            {
                name: "Anti Role Administrateur",
                value: `Status : ${database?.status["anti-roleAdmin"].status ? ("`Actif` --> Whitelist: " + (database?.status["anti-roleAdmin"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Sanction: " + `\`${database?.status["anti-roleAdmin"].sanction}\``) : "`Inactif`"}`
            },
            {
                name: "Anti mass Kick",
                value: `Status : ${database?.status["anti-massKick"].status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massKick"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massKick"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massKick"].sanction}\``) : "`Inactif`"}`
            },
            {
                name: "Anti mass Ban",
                value: `Status : ${database?.status["anti-massBan"].status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massBan"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massBan"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massBan"].sanction}\``) : "`Inactif`"}`
            },
            {
                name: "Anti mass Unban",
                value: `Status : ${database?.status["anti-massUnban"].status ? ("`Actif` --> Whitelist: " + (database?.status["anti-massUnban"].ignoreWhitelist ? "`non sanctionnable`" : "`sanctionnable`") + ", Fréquence: " + `\`${database?.status["anti-massUnban"]?.frequence}\`` + ", Sanction: " + `\`${database?.status["anti-massUnban"].sanction}\``) : "`Inactif`"}`
            },
        )

        interaction.reply({
            embeds: [embed]
        })
    }
}