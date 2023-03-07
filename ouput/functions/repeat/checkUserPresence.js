"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
exports.default = {
    name: "presenceRole",
    repeat: false,
    execute(client) {
        const guildsData = client.managers.guildsManager.map(m => m.values).filter(p => p.presenceRole.roleId);
        console.log(chalk_1.default.green.bold("[Eagle BOT - Fonctions]") + chalk_1.default.magenta("Checking Presence Role..."));
        for (let guildData of guildsData) {
            const guild = client.guilds.cache.get(guildData.guildId);
            if (!guild)
                return;
            guild.members.fetch({
                withPresences: true
            }).then(members => {
                members.map(member => {
                    var _a;
                    const activity = (_a = member.presence) === null || _a === void 0 ? void 0 : _a.activities.filter(x => x.name == "Custom Status").map(x => x.state)[0];
                    if (!activity)
                        return;
                    if (guildData.presenceRole.type == "includes") {
                        if (activity.toLowerCase().includes(guildData.presenceRole.presence.toLowerCase())) {
                            member.roles.add(guildData.presenceRole.roleId).catch(client.error);
                        }
                        else {
                            if (member.roles.cache.get(guildData.presenceRole.roleId))
                                member.roles.remove(guildData.presenceRole.roleId);
                        }
                    }
                    else {
                        if (activity.toLowerCase() == guildData.presenceRole.presence.toLowerCase()) {
                            member.roles.add(guildData.presenceRole.roleId).catch(client.error);
                        }
                        else {
                            if (member.roles.cache.get(guildData.presenceRole.roleId))
                                member.roles.remove(guildData.presenceRole.roleId);
                        }
                    }
                });
            });
        }
    }
};
