const { Guild, WebhookClient, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client');
const config = require("../../config");
const webhook = new WebhookClient({
    id: config.webhook.id,
    token: config.webhook.token,
    url: `https://discord.com/api/webhooks/${config.webhook.id}/${config.webhook.token}`
})
module.exports = {
    name: "guildDelete",
    /**
     * 
     * @param {Guild} guild 
     * @param {EagleClient} client 
     */
    async execute(client, guild) {
        client.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
            guildId: guild.id
        }).delete();
        try {
            client.managers.rolesManager.filter(g => g.guildId === guild.id).forEach(s => s.delete());
        } catch {}
        try {
            client.managers.membersManager.filter(g => g.guildId === guild.id).forEach(s => s.delete());
        } catch {}
        try {
            client.managers.mutesManager.filter(g => g.guildId === guild.id).forEach(s => s.delete());
        } catch {}
        
        if(!guild.available)return;
        webhook.send({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setTitle("Suppression d'un serveur : "+ guild.name)
                .setFields(
                    {
                        name: "Propriétaire",
                        value: `<@${guild.ownerId}> (${guild.ownerId})`
                    },
                    {
                        name: "Nombre de membres",
                        value: guild.memberCount.toString()
                    }
                )
            ]
        })
    }
}