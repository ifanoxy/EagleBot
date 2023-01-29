const { Guild, WebhookClient, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client');
const config = require("../../config");
const webhook = new WebhookClient({
    id: config.webhook.id,
    token: config.webhook.token,
    url: `https://discord.com/api/webhooks/${config.webhook.id}/${config.webhook.token}`
})
module.exports = {
    name: "guildCreate",
    /**
     * 
     * @param {Guild} guild 
     * @param {EagleClient} client 
     */
    async execute(client, guild) {
        client.managers.guildsManager.getAndCreateIfNotExists(guild.id, {
            guildId: guild.id
        }).save();
        webhook.send({
            embeds: [
                new EmbedBuilder()
                .setColor('Green')
                .setTitle("Ajout d'un nouveau serveur : "+ guild.name)
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