import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelType,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Permet de définir les logs actifs pour ce serveur")
        .addChannelOption(
            opt => opt.setName('channel').setDescription("Le channel dans lequel sera envoyé les logs").addChannelTypes(ChannelType.GuildText)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
        const logsName = Object.keys(guildData.logs);
        let paginationRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("[no-check]pagination#previous")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setLabel("⏪"),
            new ButtonBuilder()
                .setCustomId("[no-check]pagination")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setLabel("1/2"),
            new ButtonBuilder()
                .setCustomId("[no-check]pagination#next")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("⏩"),
        )
    }
}