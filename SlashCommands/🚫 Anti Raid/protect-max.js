const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("protect-max")
    .setDescription("Permet d'activer tout les protections au maximum")
    .setDMPermission(false),
    execute(interaction, client) {
        if (!client.moderation.checkOwner(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être owner pour utiliser cette commande !")
            ],
            ephemeral: true
        });
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
    }
}