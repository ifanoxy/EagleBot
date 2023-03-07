"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "messageDelete",
    execute(client, message) {
        var _a, _b, _c;
        if ((_a = message.author) === null || _a === void 0 ? void 0 : _a.bot)
            return;
        const channel = client.func.log.isActive(message.guildId, "MessageDelete");
        if (!channel)
            return;
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(`**Message de:** <@${((_b = message.author) === null || _b === void 0 ? void 0 : _b.id) || ((_c = message.member) === null || _c === void 0 ? void 0 : _c.id)}>\n\n` +
                    `**Envoyé :** <t:${Math.round(message.createdTimestamp / 1000)}:R>\n\n` +
                    `**Contenu du message :**\n\`\`\`${message.content || "'Ne contient rien'"}\`\`\`` +
                    message.attachments ? `**Fichier :** ${message.attachments.map(x => x.proxyURL).join("\n")}` : "Aucun")
            ]
        });
    }
};
