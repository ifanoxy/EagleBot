"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "inviteCreate",
    execute(client, invite) {
        const channel = client.func.log.isActive(invite.guild.id, "InviteCreate");
        if (!channel)
            return;
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(`**Code:** ${invite.code}\n\n` +
                    `**Expire** <t:${Math.round(invite.expiresTimestamp / 1000)}:R>\n\n` +
                    `**Nombre d'utilisations maximum:** ${invite.maxUses}\n\n` +
                    `**Créée par:** <@${invite.inviterId}>`)
            ]
        });
    }
};