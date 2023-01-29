const { ApplicationCommandPermissionsUpdateData, EmbedBuilder } = require('discord.js');
const { EagleClient } = require('../../structures/Client');
const path = require("path");
module.exports = {
    name: "applicationCommandPermissionsUpdate",
    /**
     *
     * @param {EagleClient} client
     * @param {ApplicationCommandPermissionsUpdateData} Parametre
     */
    execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guildId);
        if (!guildData) return;
        if (!guildData.logs.enable.ApplicationCommandPermissionUpdate) return;
        const channel = guildData.logs.channel.ApplicationCommandPermissionUpdate;
        if (channel == null || channel == undefined) return;
        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Application ID:** <@${Parametre.applicationId}> (${Parametre.applicationId})\n\n`+
                    `**Changement:**\n`
                )
                .setFields(
                    {
                        name: "Type",
                        value: Parametre.permissions.map(p => {
                            let type = p.type;
                            let id = p.id;
                            switch (type) {
                                case 1 : {
                                    type = "Role";
                                    id = `<@&${p.id}>`
                                }break;
                                case 2 : {
                                    type = "Utilisateur";
                                    id = `<@${p.id}>`;
                                }break;
                                case 3 : {
                                    type = "Channel";
                                    id = `<#${p.id}>`;
                                }break;
                            }
                            return `${type} ${id}`
                        }).join('\n'),
                        inline: true
                    },
                    {
                        name: "Permission",
                        value: Parametre.permissions.map(p => {
                            return `**${!p.permission}** --> **${p.permission}**`
                        }).join('\n'),
                        inline: true
                    },
                )
            ]
        })
    }
}
