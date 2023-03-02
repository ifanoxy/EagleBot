import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import ms from "ms";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Vous permet de rendre muet un membre du serveur")
        .setDMPermission(false)
        .addUserOption(
            option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez mute").setRequired(true)
        )
        .addStringOption(
            option => option.setName("raison").setDescription("Permet de définir la raison du mute de la personne.").setRequired(false).setMaxLength(450)
        )
        .addStringOption(
            option => option.setName("temps").setDescription("le temps du mute (w -> semaine | d -> jour | m -> minute, etc) ").setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const cible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id)

        interaction.deferReply().then(() => {
            client.func.mod.muteUser({
                userId: cible.id,
                guildId: interaction.guildId,
                executor: interaction.user.tag,
                raison: interaction.options.getString('raison') || "pas de raison",
                time: interaction.options.getString("temps") ? ms(interaction.options.getString("temps")) : Infinity,
            })
                .then(() => {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(DiscordColor.Eagle)
                                .setDescription(`Le membre ${cible.user.tag} (<@${cible.id}>) a été rendu Muet avec succès !\n\nTemps: \`${interaction.options.getString("temps") ? interaction.options.getString("temps") : Infinity}\`\nRaison: \`${interaction.options["getString"]("raison") || 'Pas de raison'}\``)
                                .setTimestamp()
                        ]
                    });
                    setTimeout(() => {
                        require("../../../functions/repeat/checkMutes").default.execute(client);
                    }, 3000)
                })
        })

        const memberData = await client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
            memberId: interaction.user.id,
        })
        memberData.moderation.mute++;
        memberData.save();
        const channelLog = client.func.log.isActive(interaction.guildId, "Mute");
        if (channelLog) this.log(interaction, cible.id, channelLog, interaction.options.getString('raison') || "pas de raison"), interaction.options.getString("temps") ? ms(interaction.options.getString("temps")) : Infinity;
    },

    log(interaction, userId, channel, raison, time) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Mute Add`)
                    .setDescription(
                        `**Membre Mute:** <@${userId}>\n\n` +
                        `**Raison:** <@${raison}>\n\n` +
                        `**Temps:** <@${time}>\n\n` +
                        `**Mute par:** <@${interaction.user.id}>`
                    )
            ]
        });
    }
}