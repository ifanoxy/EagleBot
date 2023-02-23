import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("unowner")
        .setDescription("Permet de unowner une personne du bot")
        .setDMPermission(false)
        .addStringOption(
            option => option.setName("utilisateur").setDescription("entrez la personne que vous shouaitez unowner").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused();
        const choices = client.managers.ownerManager.map(x => ({tag: client.users.cache.get(x.userId).tag, id: x.userId}));
        const filtered = choices.filter(choice => choice.tag.startsWith(focusedValue) || choice.id.startsWith(focusedValue));
        let options;
        if (filtered.length > 25) {
            options = filtered.slice(0, 25);
        } else {
            options = filtered;
        }
        await interaction.respond(
            options.map(choice => ({ name: `${choice.tag} (${choice.id})`, value: choice.id })),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const id = interaction.options.getString("utilisateur");

        client.managers.ownerManager.getAndCreateIfNotExists(id, {
            userId: id,
        }).delete();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Vous avez unowner <@${id}>`)
            ]
        });
    }
}