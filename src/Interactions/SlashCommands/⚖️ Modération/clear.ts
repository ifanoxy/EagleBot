import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Vous permet de supprimer des messages dans ce channel")
        .setDMPermission(false)
        .addIntegerOption(
            opt => opt.setName("nombre-messages").setDescription("Le nombre de message que vous souhaitez supprimer").setMaxValue(100).setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        interaction.channel.bulkDelete(interaction.options.getInteger("nombre-messages"), true)
            .then(DeleteMessages => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(DiscordColor.Eagle)
                            .setDescription(`Le membre ${interaction.user.tag} (<@${interaction.user.id}>) vient de supprimer \`${DeleteMessages.size}\` messages !`)
                            .setTimestamp()
                    ]
                })
                let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
                executorData.moderation.removedMessage += DeleteMessages.size;
                executorData.save();
            })
    }
}