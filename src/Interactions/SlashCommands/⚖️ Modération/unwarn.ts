import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Vous permet de supprimer un warn d'un membre")
        .setDMPermission(false)
        .addUserOption(
            opt => opt.setName('utilisateur').setDescription("l'utilisateur que vous souhaitez unwarn").setRequired(true)
        )
        .addStringOption(
            opt => opt.setName("warn").setDescription("le warn que vous souhaitez supprimer").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focus = interaction.options.getFocused();
        const userId = interaction.options.get("utilisateur")?.value.toString();
        const choices = client.managers.membersManager.getIfExist(userId)?.values.warn.map(x => x.reason).concat("All") || ["Ce membre n'a aucun warn !"];
        const filtered = choices.filter(choice => choice.startsWith(focus));
        let options;
        if (filtered.length > 25) {
            options = filtered.slice(0, 25);
        } else {
            options = filtered;
        }
        await interaction.respond(options.map(c => ({name: c, value: c})));
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const warn = interaction.options.getString("warn");
        if (warn == "Ce membre n'a aucun warn !")return interaction.reply({
            embeds: [{
                color: DiscordColor.DarkPurple,
                description: "Ce membre n'a pas de warn, vous ne pouvez donc pas lui en retirer"
            }],
            ephemeral: true
        });

        const user = interaction.options.getUser("utilisateur");
        let userData = client.managers.membersManager.getIfExist(user.id);
        if (userData.warn.length == 1 || warn == "All") userData.delete();
        else {
            userData.warn = userData.warn.filter(x => x.reason != warn);
            userData.save()
        }
        interaction.reply({
            embeds: [
                {
                    description: `Vous avez retiré avec succès un warn de <@${user.id}>.\n\nRaison du warn: \`${warn}\``,
                    color: DiscordColor.Eagle,
                }
            ]
        })
        const channelLog = client.func.log.isActive(interaction.guildId, "Warn");
        if (channelLog) this.log(interaction, user.id, channelLog);
    },

    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Warn Remove`)
                    .setDescription(
                        `**Membre Unwarn:** <@${userId}>\n\n` +
                        `**Unwarn par:** <@${interaction.user.id}>`
                    )
            ]
        });
    }
}