import {EagleClient} from "../../structures/Client";
import {ActivityType, Presence} from "discord.js";

export default {
    name: "presenceUpdate",
    async execute(client: EagleClient, oldPresence: Presence | null, newPresence: Presence) {
        const oldname = oldPresence?.activities.find(x => x.type == ActivityType.Custom)?.state;
        const newname = newPresence.activities.find(x => x.type == ActivityType.Custom)?.state
        if (oldname == newname)return;
        const guildData = client.managers.guildsManager.getIfExist(newPresence.guild.id);
        if (!guildData)return;
        if (!guildData.presenceRole)return;
        if (guildData?.presenceRole?.type == "includes") {
            if (guildData?.presenceRole?.presence.includes(oldname)) await newPresence.member.roles.remove(guildData?.presenceRole?.roleId, "Presence Role");
            if (guildData?.presenceRole?.presence.includes(newname)) await newPresence.member.roles.add(guildData?.presenceRole?.roleId, "Presence Role");
        } else if (guildData?.presenceRole.type == "equals") {
            if (guildData?.presenceRole?.presence == oldname) await newPresence.member.roles.remove(guildData?.presenceRole?.roleId, "Presence Role");
            if (guildData?.presenceRole?.presence == newname) await newPresence.member.roles.add(guildData?.presenceRole?.roleId, "Presence Role");
        }
    }
}