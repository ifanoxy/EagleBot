import {
    AutocompleteInteraction,
    ChatInputCommandInteraction, EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import { EagleClient } from "../../../structures/Client";
import {DiscordColor} from "../../../structures/Enumerations/Embed";

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
        )
        .addSubcommand(
            sub => sub.setName("list").setDescription("Vous permet de voir toute les permissions de toute les commandes")
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused(true)
        if (focusedValue.name == "commande") {
            const perms = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId }).permissions;
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
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let GuildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId});
        if (interaction.options.getSubcommand() == "modifier") {
            const commandName = interaction.options.getString('commande');
            const permission = interaction.options.getString("permission");

            if (!Number.isNaN(Number(permission))) {
                GuildData.permissions[commandName] = Number(permission);
            } else {
                GuildData.permissions[commandName] = permission;
            };
            GuildData.save();

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(DiscordColor.Eagle)
                        .setDescription(`\`${interaction.user.tag}\` vient de changer les permissions de la commande **${commandName}**.\nNouvelle Permission : \`${typeof GuildData.permissions[commandName] == "string" ? permission : new PermissionsBitField(BigInt(permission)).toArray()[0]}\``)
                        .setTimestamp()
                ]
            })
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(DiscordColor.Eagle)
                        .setTitle(`Voici la liste des permissions des ${client.application.commands.cache.size} commandes`)
                        .setDescription(
                            client.application.commands.cache.map(cmd => `${cmd.name} -> \`${typeof GuildData.permissions[cmd.name] == "string" ? GuildData.permissions[cmd.name] : new PermissionsBitField(BigInt(GuildData.permissions[cmd.name])).toArray()[0]}\``).join("\n")
                        )
                        .setTimestamp()
                ]
            })
        }
    }
}