import {ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Vous permet de donner un avertissement à un membre")
        .setDMPermission(false)
        .addUserOption(
            opt => opt.setName("utilisateur").setDescription("L'utilisateur que vous souhaitez avertir").setRequired(true)
        )
        .addStringOption(
            opt => opt.setName("raison").setDescription("La raison de l'avertissement de ce membre").setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const member = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id)
        const raison = interaction.options.getString("raison", true);

        if (!client.func.mod.executorIsOverCible(member, interaction.guild.members.cache.get(interaction.user.id)))
            return interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas warn un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
        })

        if (member.id == interaction.user.id)
            return interaction.reply({
                embeds: [
                    {
                        description: `Vous ne pouvez pas vous auto warn !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            })
        if (member.id == client.user.id)
            return interaction.reply({
                embeds: [
                    {
                        description: `Vous ne pouvez pas me warn !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            })

        let memberData = client.managers.membersManager.getAndCreateIfNotExists(member.id, { memberId: member.id });
        // @ts-ignore
        memberData.warn.push({
            userId: interaction.user.id,
            reason: raison,
            date: new Date(),
        })
        memberData.save();

        let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
        // @ts-ignore
        executorData.moderation.warn++;
        executorData.save();

        interaction.reply({
            embeds: [
                {
                    description: `Le membre ${member.user.tag} (<@${member.id}>) a été warn avec succès !\n\nraisson: \`${raison}\``,
                    color: DiscordColor.Eagle
                }
            ]
        });
    }
}