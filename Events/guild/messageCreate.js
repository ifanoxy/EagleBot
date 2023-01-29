const { AuditLogEvent, EmbedBuilder, Message, messageLink } = require("discord.js")
const path = require("path");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {Message} Parametre 
     */
    async execute(client, Parametre) {
        if (Parametre.member?.bot)return;
        if (!Parametre.guildId)return;
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.anti.link.active)return;
    }
}