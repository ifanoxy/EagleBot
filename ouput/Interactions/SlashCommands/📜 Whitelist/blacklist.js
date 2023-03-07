"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("bl")
        .setDescription("Permet d'ajouter une personne à la blacklist")
        .setDMPermission(false)
        .addStringOption(option => option.setName("id").setDescription("entrez l'identifiant de la personne que vous shouaitez blacklist").setRequired(true)).addStringOption(option => option.setName("raison").setDescription("entrez la raison pour laquelle vous shouaitez blacklist cette personne").setRequired(false)),
    execute(interaction, client) {
        const id = interaction.options.getString("id");
        if (!client.isSnowflake(id))
            return interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Vous devez rentrer un identifiant !")
                ],
                ephemeral: true
            });
        if (client.isBlacklist(id))
            return interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Cette identifiant est déjà dans la blacklist")
                ],
                ephemeral: true
            });
        const raison = interaction.options.getString("raison");
        client.guilds.cache.map(guild => {
            if (guild.members.cache.has(id)) {
                guild.members.cache.get(id).ban({ reason: "Blacklist" }).catch(() => {
                    if (interaction.channel.type == discord_js_1.ChannelType.GuildStageVoice)
                        return;
                    interaction.channel.send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Red")
                                .setDescription(`Je n'ai pas pu bannir cette identifiant dans le serveur ${guild.name}`)
                        ]
                    });
                });
            }
        });
        client.managers.blacklistManager.getAndCreateIfNotExists(id, {
            userId: id,
            reason: raison || "pas de raison",
            authorId: interaction.user.id,
        }).save();
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Vous avez ajouté l'identifiant \`${id}\` à la blacklist`)
            ]
        });
        const channelLog = client.func.log.isActive(interaction.guildId, "BlackListUpdate");
        if (channelLog)
            this.log(interaction, id, channelLog);
    },
    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Blacklist Add`)
                    .setDescription(`**Membre Ajouté:** <@${userId}>\n\n` +
                    `**Raison:** <@${interaction.options.getString("raison") || "pas de raison"}>\n\n` +
                    `**Ajouté par:** <@${interaction.user.id}>`)
            ]
        });
    }
};
