import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("wl")
        .setDescription("Permet d'ajouter une personne à la whitelist bot")
        .setDMPermission(false)
        .addUserOption(
            option => option.setName("utilisateur").setDescription("entrez l'utilisateur que vous shouaitez whitelist").setRequired(true)
        )
        .addStringOption(
            opt => opt.setName("raison").setDescription("La raison pour laquel vous voulez whitelist ce membre")
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const id = interaction.options.getUser("utilisateur").id;

        if (client.isWhitelist(id))return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Cette utilisateur est déjà whitelist")
            ],
            ephemeral: true
        });

        client.managers.whitelistManager.getAndCreateIfNotExists(id, {
            userId: id,
            authorId: interaction.user.id,
            reason: interaction.options.getString("raison") || "Pas de raison",
        }).save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Vous avez ajouté <@${id}> à la whitelist`)
            ]
        });
    }
}