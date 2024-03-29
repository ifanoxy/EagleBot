import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";
import ms from "ms";

export default {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Vous permet de rendre la parole à un membre mute")
        .setDMPermission(false)
        .addStringOption(
            option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez unmute").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused();
        let choices: Array<{username: string, id: string, reason: string}> = [];
        client.managers.muteManager.map(mute => {
            if (mute.guildId != interaction.guildId)return;
            choices.push({
                username: interaction.guild.members.cache.get(mute.memberId).user.tag,
                id: mute.memberId,
                reason: mute.reason,
            })
        })
        const filtered = choices.filter(choice => choice.username.startsWith(focusedValue) || choice.id.startsWith(focusedValue) || choice.reason.startsWith(focusedValue));
        let options;
        if (filtered.length > 25) {
            options = filtered.slice(0, 25);
        } else {
            options = filtered;
        }
        await interaction.respond(
            options.map(choice => ({ name: `${choice.username} (${choice.id}) --> ${choice.reason}`, value: choice.id })),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const muteId = interaction.options.getString("utilisateur");
        let muteData = client.managers.muteManager.getIfExist(`${muteId}-${interaction.guildId}`);
        const guildData = client.managers.guildsManager.getIfExist(interaction.guildId);
        client.guilds.cache.get(interaction.guildId).members.cache.get(muteId).roles.remove(guildData.muteRoleId)
            .then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(DiscordColor.Eagle)
                            .setDescription(`Le membre <@${muteId}> a regagner la parole avec succès !`)
                            .setTimestamp()
                    ]
                });
                muteData.delete();
            })
            .catch(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("DarkRed")
                            .setDescription("Il y a eu un problème lors de la suppression du rôle !")
                    ],
                    ephemeral: true
                });
            })
        const channelLog = client.func.log.isActive(interaction.guildId, "Mute");
        if (channelLog) this.log(interaction, muteId, channelLog);
    },

    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Mute Remove`)
                    .setDescription(
                        `**Membre Unmute:** <@${userId}>\n\n` +
                        `**Unmute par:** <@${interaction.user.id}>`
                    )
            ]
        });
    }
}