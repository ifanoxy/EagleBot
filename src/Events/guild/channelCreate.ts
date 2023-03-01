import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, ChannelType, EmbedBuilder, GuildChannel} from "discord.js";

export default {
    name: "ChannelCreate",
    execute(client: EagleClient, channel: GuildChannel) {
        const channelSend = client.func.log.isActive(channel.guildId, "ChannelCreate");
        if (!channelSend)return;
        let type;
        switch (channel.type) {
            case ChannelType.GuildAnnouncement: {
                type = "Channel d'annonce"
            }break;
            case ChannelType.AnnouncementThread: {
                type = "Thread channel d'annonce"
            }break;
            case ChannelType.GuildCategory: {
                type = "Categorie"
            }break;
            case ChannelType.GuildForum: {
                type = "Forum"
            }break;
            case ChannelType.GuildStageVoice: {
                type = "Channel de réunion"
            }break;
            case ChannelType.GuildText: {
                type = "Channel Textuel"
            }break;
            case ChannelType.GuildVoice: {
                type = "Channel vocal"
            }break;
            case ChannelType.GuildNews: {
                type = "Thread Public"
            }break;
            case ChannelType.GuildPublicThread: {
                type = "Thread Public"
            }break;
            case ChannelType.GuildPrivateThread: {
                type = "Thread Privé"
            }break;
        }
        channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate,
        }).then(audit => {
            channelSend.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(
                            `**Nom:** ${channel.name}\n\n` +
                            `**Type:** ${type}\n\n` +
                            `**Channel:** <#${channel.id}> (${channel.id})\n\n` +
                            `**Catégorie:** <#${channel.parentId || "Aucune"}>\n\n` +
                            `**Créé par:** <@${audit.entries.first()?.executor.id}>`
                        )
                ]
            });
        });
    }
}