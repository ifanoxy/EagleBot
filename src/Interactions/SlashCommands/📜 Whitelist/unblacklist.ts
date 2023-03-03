import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("unbl")
        .setDescription("Permet de unblacklist une personne du bot")
        .setDMPermission(false)
        .addStringOption(
            option => option.setName("utilisateur").setDescription("entrez la personne que vous shouaitez unblacklist").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused();
        let choices = client.managers.blacklistManager.map(x => x.userId);
        choices.unshift("all")
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        let options;
        if (filtered.length > 25) {
            options = filtered.slice(0, 25);
        } else {
            options = filtered;
        }
        await interaction.respond(
            options.map(choice => ({ name: `${choice}`, value: choice })),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const id = interaction.options.getString("utilisateur");
        if (id == "all") {
            client.managers.blacklistManager.map(x => {
                x.delete()
            })
        } else {
            client.managers.blacklistManager.getAndCreateIfNotExists(id, {
                userId: id,
            }).delete();
        }

        const channelLog = client.func.log.isActive(interaction.guildId, "BlackListUpdate");
        if (channelLog) this.log(interaction, id, channelLog);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Vous avez unblacklist <@${id}>`)
            ]
        });
    },

    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Blacklist Remove`)
                    .setDescription(
                        `**Membre Retiré:** <@${userId}>\n\n` +
                        `**Retiré par:** <@${interaction.user.id}>`
                    )
            ]
        });
    }
}