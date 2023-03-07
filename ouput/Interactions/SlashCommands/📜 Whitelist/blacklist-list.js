"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("bl-list")
        .setDescription("Permet de voir la liste des blacklist du bot.")
        .setDMPermission(false),
    execute(interaction, client) {
        let ownerData = client.managers.blacklistManager.map(x => {
            return {
                name: `${x.userId}`,
                value: `**Utilisateur :** <@${x.userId}>\n**Ajouté par :** <@${x.authorId}>\n**Raison :** *${x.reason}*`
            };
        });
        let embedOwner = new discord_js_1.EmbedBuilder().setTitle(`Liste des ${ownerData.length} Blacklist`).setColor("NotQuiteBlack");
        if (ownerData.length > 25) {
            client.func.utils.pagination(embedOwner, ownerData.map(x => x.name), ownerData.map(x => x.value), interaction);
        }
        else {
            let i = 0;
            interaction.reply({
                embeds: [
                    embedOwner.addFields(ownerData.map(x => { i++; return { name: i + ". " + x.name, value: x.value, inline: true }; }))
                ]
            });
        }
    }
};
