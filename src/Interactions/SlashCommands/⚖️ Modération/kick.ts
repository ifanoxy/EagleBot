import {ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Vous permet d'expulser un membre du serveur.")
        .setDMPermission(false)
        .addUserOption(
            opt => opt.setName("utilisateur").setDescription("Choisissez l'utilisateur que vous souhaitez kick.").setRequired(true)
        )
        .addStringOption(
            opt => opt.setName("raison").setDescription("La raison du kick pour se membre").setMaxLength(450)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient)
    {
        const memberCible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
        const memberExecutor = interaction.guild.members.cache.get(interaction.user.id);

        if (!client.func.mod.memberKicable(memberCible, memberExecutor, interaction))return;

        memberCible.kick(`Demandé par ${interaction.user.tag} (${interaction.user.id}) | ` + interaction.options["getString"]("raison") || "pas de raison")
            .then(kickMember => {
                interaction.reply({
                    embeds: [
                        {
                            description: `Le membre ${kickMember.user.tag} (<@${kickMember.id}>) a été kick avec succès !\n\nraison: \`${interaction.options["getString"]("raison") || 'Pas de raison'}\``,
                            color: DiscordColor.Eagle
                        }
                    ]
                });
                let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
                executorData.moderation.kick++;
                executorData.save();
            })
            .catch(reason => {
                interaction.reply({
                    embeds: [
                        {
                            description: `Il y a eu une erreur lors de l'expulsion du membre !\n\nErreur : \`${reason}\``,
                            color: DiscordColor.Red
                        }
                    ],
                    ephemeral: true
                })
            });
    }
}