import {CommandInteraction, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Vous permet d'expulser un membre du serveur.")
        .setDMPermission(false)
        .addUserOption(
            opt => opt.setName("utilisateur").setDescription("Choisissez l'utilisateur que vous souhaitez kick.").setRequired(true)
        )
        .addStringOption(
            opt => opt.setName("raison").setDescription("La raison du kick pour se membre")
        ),
    async execute(interaction: CommandInteraction, client: EagleClient)
    {
        const memberCible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
        const memberExecutor = interaction.guild.members.cache.get(interaction.user.id);
        const Kickable = client.func.mod.memberKicable(memberCible, memberExecutor);

        if (Kickable)
        {
            memberCible.kick(`Demandé par ${interaction.user.tag} (${interaction.user.id}) | ` + interaction.options["getString"]("raison") || "pas de raison")
                .then(kickMember => {
                    interaction.reply({
                        embeds: [
                            {
                                description: `Le member ${kickMember.user.tag} (<@${kickMember.id}>) a été kick avec succès !\n\nraison: \`${interaction.options["getString"]("raison") || 'Pas de raison'}\``,
                                color: DiscordColor.Green
                            }
                        ]
                    });
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
        else
        {
            if (Kickable == null) {
                interaction.reply({
                    embeds: [
                        {
                            title: `Permissions insuffisantes`,
                            description: `J'ai besoin de la permission \`Kick_Members\` pour que cette commande soit fonctionnelle !`,
                            color: DiscordColor.Red
                        }
                    ],
                    ephemeral: true
                });
            }
            else
            {
                interaction.reply({
                    embeds: [
                        {
                            title: `Permissions insuffisantes`,
                            description: `Vous avez besoin de la permission \`Kick_Members\` pour utiliser cette commande !`,
                            color: DiscordColor.Orange
                        }
                    ],
                    ephemeral: true
                });
            }
        }
    }
}