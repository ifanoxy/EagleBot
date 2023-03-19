import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildChannel, GuildMember} from "discord.js";

export default {
    name: "guildMemberRemove",
    execute(client: EagleClient, member: GuildMember) {
        const guildData = client.managers.guildsManager.getIfExist(member.guild.id);
        if (!guildData)return;
        if (guildData.leave.channelId) client.func.mod.sendLeaveMessage(member.guild.id, member);
    }
}