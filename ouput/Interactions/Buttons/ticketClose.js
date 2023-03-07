"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../structures/Enumerations/Embed");
exports.default = {
    execute(interaction, client) {
        var _a;
        interaction.channel.setName(`${interaction.channel.name.split("-")[0]}-lock`);
        // @ts-ignore
        interaction.channel.permissionOverwrites.edit((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.topic, {
            ViewChannel: false
        });
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(Embed_1.DiscordColor.Eagle)
                    .setTitle("Ticket Fermé !")
                    .setDescription(`Ticket fermé par \`${interaction.user.tag}\``)
                    .setTimestamp()
            ],
            components: [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("ticketDelete")
                    .setLabel("Supprimer le ticket")
                    .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
                    .setCustomId("ticketOpen")
                    .setLabel("Réouvrir le ticket")
                    .setStyle(discord_js_1.ButtonStyle.Success))
            ]
        });
    }
};
