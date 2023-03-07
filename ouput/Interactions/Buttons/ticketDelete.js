"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    execute(interaction, client) {
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor('Red').setDescription("Suppression du ticket..")
            ]
        }).then(() => {
            setTimeout(() => {
                interaction.channel.delete();
            }, 1000);
        });
    }
};
