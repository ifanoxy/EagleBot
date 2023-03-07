"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "applicationCommandPermissionsUpdate",
    execute(client, data) {
        const channel = client.func.log.isActive(data.guildId, "ApplicationCommandPermissionUpdate");
        if (!channel)
            return;
        if (data.permissions.length == 0) {
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**Application ID:** <@${data.applicationId}> (${data.applicationId})\n\n` +
                        `**Changement:** Permissions défauts`)
                ]
            });
        }
        else {
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**Application ID:** <@${data.applicationId}> (${data.applicationId})\n\n` +
                        `**Changement:**\n`)
                        .addFields({
                        name: "Type",
                        value: data.permissions.map(p => {
                            let type = p.type;
                            let id = p.id;
                            switch (type) {
                                case 1:
                                    {
                                        type = "Role";
                                        id = `<@&${p.id}>`;
                                    }
                                    break;
                                case 2:
                                    {
                                        type = "Utilisateur";
                                        id = `<@${p.id}>`;
                                    }
                                    break;
                                case 3:
                                    {
                                        type = "Channel";
                                        id = `<#${p.id}>`;
                                    }
                                    break;
                            }
                            return `${type} ${id}`;
                        }).join('\n'),
                        inline: true
                    }, {
                        name: "Permission",
                        value: data.permissions.map(p => {
                            return `**${!p.permission}** --> **${p.permission}**`;
                        }).join('\n'),
                        inline: true
                    })
                ]
            });
        }
    }
};
