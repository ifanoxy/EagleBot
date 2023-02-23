import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("owner")
        .setDescription("Permet d'ajouter une personne owner du bot")
        .setDMPermission(false)
        .addUserOption(
            option => option.setName("utilisateur").setDescription("entrez l'utilisateur que vous shouaitez passer owner").setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const id = interaction.options.getUser("utilisateur").id;

        if (client.isOwner(id))return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Cette utilisateur est déjà owner")
            ],
            ephemeral: true
        });

        client.managers.ownerManager.getAndCreateIfNotExists(id, {
            userId: id,
        }).save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Vous avez ajouté <@${id}> en tant que owner`)
            ]
        });
    }
}