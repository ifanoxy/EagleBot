"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "presenceUpdate",
    execute(client, oldPresence, newPresence) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            const oldname = (_a = oldPresence === null || oldPresence === void 0 ? void 0 : oldPresence.activities.find(x => x.type == discord_js_1.ActivityType.Custom)) === null || _a === void 0 ? void 0 : _a.state;
            const newname = (_b = newPresence.activities.find(x => x.type == discord_js_1.ActivityType.Custom)) === null || _b === void 0 ? void 0 : _b.state;
            if (oldname == newname)
                return;
            const guildData = client.managers.guildsManager.getIfExist(newPresence.guild.id);
            if (!guildData)
                return;
            if (!guildData.presenceRole)
                return;
            if (((_c = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _c === void 0 ? void 0 : _c.type) == "includes") {
                if ((_d = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _d === void 0 ? void 0 : _d.presence.includes(oldname))
                    yield newPresence.member.roles.remove((_e = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _e === void 0 ? void 0 : _e.roleId, "Presence Role");
                if ((_f = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _f === void 0 ? void 0 : _f.presence.includes(newname))
                    yield newPresence.member.roles.add((_g = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _g === void 0 ? void 0 : _g.roleId, "Presence Role");
            }
            else if ((guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole.type) == "equals") {
                if (((_h = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _h === void 0 ? void 0 : _h.presence) == oldname)
                    yield newPresence.member.roles.remove((_j = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _j === void 0 ? void 0 : _j.roleId, "Presence Role");
                if (((_k = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _k === void 0 ? void 0 : _k.presence) == newname)
                    yield newPresence.member.roles.add((_l = guildData === null || guildData === void 0 ? void 0 : guildData.presenceRole) === null || _l === void 0 ? void 0 : _l.roleId, "Presence Role");
            }
        });
    }
};
