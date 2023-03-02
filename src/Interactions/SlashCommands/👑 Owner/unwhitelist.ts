import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("unwl")
        .setDescription("Permet de unwhitelist une personne du bot")
        .setDMPermission(false)
        .addStringOption(
            option => option.setName("utilisateur").setDescription("entrez la personne que vous shouaitez unwhitelist").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused();
        let choices = client.managers.whitelistManager.map(x => ({tag: client.users.cache.get(x.userId).tag, id: x.userId}));
        choices.unshift({tag: "All", id:"all"})
        const filtered = choices.filter(choice => choice.tag.startsWith(focusedValue) || choice.id.startsWith(focusedValue));
        let options;
        if (filtered.length > 25) {
            options = filtered.slice(0, 25);
        } else {
            options = filtered;
        }
        await interaction.respond(
            options.map(choice => ({ name: `${choice.tag} (${choice.id})`, value: choice.id })),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const id = interaction.options.getString("utilisateur");
        if (id == "all") {
            client.managers.whitelistManager.map(x => {
                x.delete()
            })
        } else {
            client.managers.whitelistManager.getAndCreateIfNotExists(id, {
                userId: id,
            }).delete();
        }

        const channelLog = client.func.log.isActive(interaction.guildId, "WhiteListUpdate");
        if (channelLog) this.log(interaction, id, channelLog);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Vous avez unwhitelist <@${id}>`)
            ]
        });
    },

    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Whitelist Remove`)
                    .setDescription(
                        `**Membre Retiré:** <@${userId}>\n\n` +
                        `**Retiré par:** <@${interaction.user.id}>`
                    )
            ]
        });
    }
}