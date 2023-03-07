"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    execute(interaction, client) {
        const categorieId = interaction.customId.split('#')[1];
        interaction.guild.channels.create({
            name: `${interaction.user.username}-${interaction.component.label}`,
            topic: interaction.user.id,
            parent: categorieId,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [discord_js_1.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [discord_js_1.PermissionsBitField.Flags.ViewChannel, discord_js_1.PermissionsBitField.Flags.SendMessages]
                }
            ]
        })
            .then(channel => {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle("Ticket créer avec succès !")
                        .setDescription(`Votre ticket est disponible ici --> <#${channel.id}>`)
                ],
                ephemeral: true
            });
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle(`Nouveau ticket de ${interaction.user.username}`)
                        .setDescription(`Vous avez créer ce ticket pour la raison : ${interaction.component.label}.`)
                        .setColor("DarkGold")
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setLabel("Fermer le ticket")
                        .setCustomId("ticketClose")
                        .setEmoji("🔒")
                        .setStyle(discord_js_1.ButtonStyle.Secondary))
                ]
            });
        });
    }
};
