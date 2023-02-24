import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
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
            const perms = client.managers.guildsManager.getIfExist(interaction.guildId).permissions;
            const choices = client.application.commands.cache.map(x => ({name: `${x.name} | ${typeof perms[x.name] == "string" ? perms[x.name] : new PermissionsBitField(BigInt(perms[x.name])).toArray()[0]}`, value: x.name}))
            const filtered = choices.filter(choice => choice.name.toLocaleLowerCase().includes(focusedValue.value.toLocaleLowerCase())).slice(0, 25);
            await interaction.respond(
                filtered.map(choice => ({name: choice.name, value: choice.value})),
            );
        } else {
            const permissions = Object.keys(PermissionsBitField.Flags).map(x => ({name: x, value: String(PermissionsBitField.Flags[x])}))
            const choices: {name: string, value: string}[] = [
                {
                    name: "owner", value: "owner"
                },{
                    name: "whitelist", value: "whitelist"
                }
            ].concat(permissions);
            const filtered = choices.filter(choice => choice.name.toLocaleLowerCase().includes(focusedValue.value.toLocaleLowerCase())).slice(0, 25);
            await interaction.respond(
                filtered.map(choice => ({name: choice.name, value: choice.value})),
            );
        }
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const commandName = interaction.options.getString('commande');
        const permission = interaction.options.getString("permission");

        let GuildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
        try {
            GuildData.permissions[commandName] == Number(permission);
        } catch {
            GuildData.permissions[commandName] == permission;
        }
    }
}