"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("owner")
        .setDescription("Permet d'ajouter une personne owner du bot")
        .setDMPermission(false)
        .addUserOption(option => option.setName("utilisateur").setDescription("entrez l'utilisateur que vous shouaitez passer owner").setRequired(true)),
    execute(interaction, client) {
        const id = interaction.options.getUser("utilisateur").id;
        if (client.isOwner(id))
            return interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Cette utilisateur est déjà owner")
                ],
                ephemeral: true
            });
        client.managers.ownerManager.getAndCreateIfNotExists(id, {
            userId: id,
        }).save();
        const channelLog = client.func.log.isActive(interaction.guildId, "OwnerUpdate");
        if (channelLog)
            this.log(interaction, id, channelLog);
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Vous avez ajouté <@${id}> en tant que owner`)
            ]
        });
    },
    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Owner Add`)
                    .setDescription(`**Membre Ajouté:** <@${userId}>\n\n` +
                    `**Ajouté par:** <@${interaction.user.id}>`)
            ]
        });
    }
};
