import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("bl-list")
        .setDescription("Permet de voir la liste des blacklist du bot.")
        .setDMPermission(false),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let ownerData = client.managers.blacklistManager.map(x => {
            return {
                name: `${x.userId}`,
                value: `**Utilisateur :** <@${x.userId}>\n**Ajouté par :** <@${x.authorId}>\n**Raison :** *${x.reason}*`
            }
        });

        let embedOwner = new EmbedBuilder().setTitle(`Liste des ${ownerData.length} Blacklist`).setColor("NotQuiteBlack")
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