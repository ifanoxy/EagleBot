import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import * as stream from "stream";

export default {
    data: new SlashCommandBuilder()
        .setName("ban-list")
        .setDescription("Vous permet d'avoir la liste des utilisateurs bannis de votre serveur")
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const guildBans = await interaction.guild.bans.fetch();
        if (guildBans.size == 0)return interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription("Il y a personne de banni sur ce serveur !")
            ]
        })
        let embedBans = new EmbedBuilder().setTitle(`Liste des ${guildBans.size} membres bannis`).setColor("Gold")

        if (guildBans.size > 25) {
            let name = guildBans.map(x => `${x.user.id} | ${x.user.tag}`);
            let value = guildBans.map(x => `Raison: ${x.reason}`)
            client.func.utils.pagination(embedBans, name, value, interaction)
        } else {
            let i = 1;
            guildBans.map(ban => {
                embedBans.addFields({
                    name: `${i}. ${ban.user.id} | ${ban.user.tag}`,
                    value: `Raison: \`${ban.reason}\``
                })
                i++;
            })
            interaction.reply({
                embeds: [
                    embedBans
                ]
            })
        }
    }
}