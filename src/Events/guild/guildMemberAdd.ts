import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildMember, TextChannel} from "discord.js";

export default {
    name: "guildMemberAdd",
    execute(client: EagleClient, member: GuildMember) {
        if (member.user?.bot) {
            const logChannel = client.func.log.isActive(member.guild.id, "botAdd");
            if (logChannel) this.botAdd(member, logChannel);
        }
        if (client.isBlacklist(member.id)) member.ban({reason: "Blacklist"}).catch()
        const guildData = client.managers.guildsManager.getIfExist(member.guild.id);
        if (!guildData)return;
        if (guildData?.autoroles?.length != 0)this.autoroles(member, guildData.autoroles);
        if (guildData?.greetPing?.status) this.greetPing(member, guildData.greetPing);
        if (guildData?.join?.channelId) client.func.mod.sendJoinMessage(member.guild.id, member);
    },

    async greetPing(member: GuildMember, Data) {
        for (let channel of Data.channels) {
            ((await member.guild.channels.fetch(channel)) as TextChannel).send(`<@${member.id}>`).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 200)
            })
        }
    },

    autoroles(member: GuildMember, roles: Array<string>) {
        member.roles.add(roles).catch(() => {})
    },

    botAdd(member, channel) {
        member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.BotAdd,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | Bot Add`)
                        .setThumbnail(member.avatarURL())
                        .setDescription(
                            `**Bot ID:** <@${member.id}> (${member.id})\n\n` +
                            `**Ajouté par:** <@${audit.entries.first()?.executor?.id}>`
                        )
                ]
            });
        });
    }
}