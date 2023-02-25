import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("wl-list")
        .setDescription("Permet de voir la liste des whitelist du bot.")
        .setDMPermission(false),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let ownerData = client.managers.whitelistManager.map(x => {
            const user = client.users.cache.get(x.userId);
            return {
                name: `${user.tag}`,
                value: `**Utilisateur :** <@${user.id}>\n**ID :** \`${user.id}\`\n**Ajouté par :** <@${x.authorId}>\n**Raison :** *${x.reason}*`
            }
        });
        client.managers.ownerManager.map(x => {
            const user = client.users.cache.get(x.userId);
            ownerData.unshift({
                name: `${user.tag}`,
                value: `**Utilisateur :** <@${user.id}>\n**ID :** \`${user.id}\``
            })
        });
        ownerData.unshift({
            name: `${client.users.cache.get(client.config.ownerId).tag}`,
            value: `**Utilisateur :** <@${client.users.cache.get(client.config.ownerId).id}>\n**ID :** \`${client.users.cache.get(client.config.ownerId).id}\``
        });

        let embedOwner = new EmbedBuilder().setTitle(`Liste des ${ownerData.length} Whitelist`).setColor("White")
        if (ownerData.length > 25) {
            client.func.utils.pagination(embedOwner, ownerData.map(x => x.name), ownerData.map(x => x.value), interaction);
        } else {
            let i = 0;
            interaction.reply({
                embeds: [
                    embedOwner.addFields(ownerData.map(x => {i++;return{name: i+". "+x.name, value: x.value, inline: true}}))
                ]
            })
        }
    }
}