"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("owner-list")
        .setDescription("Permet de voir la liste des owners du bot.")
        .setDMPermission(false),
    execute(interaction, client) {
        let ownerData = client.managers.ownerManager.map(x => {
            const user = client.users.cache.get(x.userId);
            return {
                name: `${user.tag}`,
                value: `**Utilisateur :** <@${user.id}>\n**ID :** \`${user.id}\``
            };
        });
        ownerData.unshift({
            name: `${client.users.cache.get(client.config.ownerId).tag}`,
            value: `**Utilisateur :** <@${client.users.cache.get(client.config.ownerId).id}>\n**ID :** \`${client.users.cache.get(client.config.ownerId).id}\``
        });
        let embedOwner = new discord_js_1.EmbedBuilder().setTitle(`Liste des ${ownerData.length} owners`).setColor("Gold");
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
