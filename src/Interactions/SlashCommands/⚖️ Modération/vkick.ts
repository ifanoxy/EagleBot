import {ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("vkick")
        .setDescription("Vous permet de kick un membre d'un salon vocal")
        .setDMPermission(false)
        .addUserOption(
            opt => opt.setName("utilisateur").setDescription("L'utilisateur que vous souhaitez kick du vocal").setRequired(true)
        )
        .addStringOption(
            opt => opt.setName("raison").setDescription("La raison du voice kick pour se membre").setMaxLength(450)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient)
    {
        const memberCible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
        const memberExecutor = interaction.guild.members.cache.get(interaction.user.id);

        if (!client.func.mod.memberVoiceKicable(memberCible, memberExecutor, interaction))return;

        memberCible.voice.disconnect(`Demandé par ${interaction.user.tag} (${interaction.user.id}) | ` + interaction.options["getString"]("raison") || "pas de raison")
            .then(kickMember => {
                interaction.reply({
                    embeds: [
                        {
                            description: `Le membre ${kickMember.user.tag} (<@${kickMember.id}>) a été déconnecté du vocal avec succès !\n\nraison: \`${interaction.options["getString"]("raison") || 'Pas de raison'}\``,
                            color: DiscordColor.Eagle
                        }
                    ]
                });
            })
            .catch(reason => {
                interaction.reply({
                    embeds: [
                        {
                            description: `Il y a eu une erreur lors de la déconnection vocale du membre !\n\nErreur : \`${reason}\``,
                            color: DiscordColor.Red
                        }
                    ],
                    ephemeral: true
                })
            });
    }
}