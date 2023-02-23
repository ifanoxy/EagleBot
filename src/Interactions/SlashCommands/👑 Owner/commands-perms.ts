import {AutocompleteInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("commands-perms")
        .setDescription("Vous permet de modifier les permissions des commandes")
        .setDMPermission(false)
        .addSubcommand(
            sub => sub.setName("modifier").setDescription("vous permet de modifier la permission d'une commande")
                .addStringOption(
                    opt => opt.setName("commande").setDescription("La commande que vous souhaitez modifier").setRequired(true).setAutocomplete(true)
                )
                .addStringOption(
                    opt => opt.setName("permission").setDescription("la nouvelle permission pour utiliser cette commande").setRequired(true).setAutocomplete(true)
                )
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused(true)
        if (focusedValue.name == "commande") {
            const choices = client.application.commands.cache.map(x => x.name)
            const filtered = choices.filter(choice => choice.startsWith(focusedValue.value));
            let options;
            if (filtered.length > 25) {
                options = filtered.slice(0, 25);
            } else {
                options = filtered;
            }
            await interaction.respond(
                options.map(choice => ({name: choice, value: choice})),
            );
        } else {
            const permissions = new PermissionsBitField().toArray().map(x => ({name: x[0], value: String(PermissionsBitField.Flags[x[0]])}))
            const choices: {name: string, value: string}[] = [
                {
                    name: "owner", value: "owner"
                },{
                    name: "whitelist", value: "whitelist"
                }
            ]
            choices.concat(permissions)
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue.value));
            let options;
            if (filtered.length > 25) {
                options = filtered.slice(0, 25);
            } else {
                options = filtered;
            }
            await interaction.respond(
                options.map(choice => ({name: choice.name, value: choice.value})),
            );
        }
    }
}