"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../structures/Enumerations/Embed");
exports.default = {
    execute(interaction, client) {
        interaction.channel.setName(`${interaction.channel.name.split("-")[0]}-open`);
        interaction.channel.fetch().then(channel => {
            channel.permissionOverwrites.edit(channel === null || channel === void 0 ? void 0 : channel.topic, {
                ViewChannel: true
            }).then(() => {
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(Embed_1.DiscordColor.Eagle)
                            .setTitle("Ticket Réouvert !")
                            .setDescription(`Ticket réouvert par \`${interaction.user.tag}\``)
                            .setTimestamp()
                    ],
                    components: [
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                            .setLabel("Fermer le ticket")
                            .setCustomId("ticketClose")
                            .setEmoji("🔒")
                            .setStyle(discord_js_1.ButtonStyle.Secondary))
                    ]
                });
            });
        });
        interaction.message.delete();
    }
};
