"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
    name: "emojiUpdate",
    execute(client, oldEmoji, newEmoji) {
        var _a, _b;
        const AntiraidData = client.managers.antiraidManager.getIfExist(newEmoji.guild.id);
        if (!((_b = (_a = AntiraidData === null || AntiraidData === void 0 ? void 0 : AntiraidData.status["anti-massEmoji"]) === null || _a === void 0 ? void 0 : _a.update) === null || _b === void 0 ? void 0 : _b.status))
            this.antiraid(AntiraidData, newEmoji, client);
        const channel = client.func.log.isActive(newEmoji.guild.id, "EmojiUpdate");
        if (!channel)
            return;
        let changement = {};
        if (oldEmoji.name != newEmoji.name)
            changement.name = {
                old: oldEmoji.name,
                new: newEmoji.name,
            };
        if (Object.entries(changement).length == 0)
            return;
        let logEmbed = new discord_js_1.EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${this.name}`).setTimestamp().setDescription(`Channel ID : ${newEmoji.id} (<#${newEmoji.id}>)`);
        if (changement.name)
            logEmbed.addFields({
                name: "Changement de nom",
                value: `Ancien: ${changement.name.old}\nNouveau: ${changement.name.new}`
            });
        channel.send({
            embeds: [logEmbed]
        });
    },
    antiraid(AntiraidData, channel, client) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const AuditLog = yield channel.guild.fetchAuditLogs({ limit: 1, type: discord_js_1.AuditLogEvent.EmojiUpdate });
            const userId = AuditLog.entries[0].user.id;
            if (client.isOwner(userId))
                return;
            if (AntiraidData.status["anti-massEmoji"].update.ignoreWhitelist) {
                if (client.isWhitelist(userId))
                    return;
            }
            const maxfrequence = Number(AntiraidData.status["anti-massEmoji"].update.frequence.split('/')[0]);
            try {
                var frequenceData = (_a = `../frequence/${userId}.json`, Promise.resolve().then(() => __importStar(require(_a))));
            }
            catch (_b) {
                var frequenceData = {};
            }
            if (((frequenceData === null || frequenceData === void 0 ? void 0 : frequenceData.emojiUpdate) || 0) < maxfrequence - 1) {
                frequenceData.emojiUpdate = ((frequenceData === null || frequenceData === void 0 ? void 0 : frequenceData.emojiUpdate) || 0) + 1;
                client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                setTimeout(() => {
                    try {
                        frequenceData.emojiUpdate -= 1;
                        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                    }
                    catch (_a) { }
                }, (Number(AntiraidData.status["anti-massEmoji"].update.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massEmoji"].update.frequence.split('/')[1].length - 1)) * 1000));
                return;
            }
            const member = yield channel.guild.members.fetch(userId);
            yield client.func.mod.applySanction(member[0], AntiraidData.status["anti-massEmoji"].update.sanction, AntiraidData, "Mass Channel Create");
            frequenceData === null || frequenceData === void 0 ? true : delete frequenceData.emojiUpdate;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
        });
    }
};
