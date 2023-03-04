import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    TextChannel
} from "discord.js";
import {EagleClient} from "../../structures/Client";
import {DiscordColor} from "../../structures/Enumerations/Embed";

export default {
    execute(interaction: ButtonInteraction, client: EagleClient) {
        interaction.channel.setName(`${interaction.channel.name.split("-")[0]}-lock`);
        // @ts-ignore
        interaction.channel.permissionOverwrites.edit(interaction.channel?.topic, {
                ViewChannel: false
            })
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(DiscordColor.Eagle)
                    .setTitle("Ticket Fermé !")
                    .setDescription(`Ticket fermé par \`${interaction.user.tag}\``)
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("ticketDelete")
                        .setLabel("Supprimer le ticket")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId("ticketOpen")
                        .setLabel("Réouvrir le ticket")
                        .setStyle(ButtonStyle.Success),
                )
            ]
        })
    }
}