"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = require("discord.js");
exports.default = {
    name: "checkMute",
    repeat: true,
    execute(client) {
        const mutesData = client.managers.muteManager.map(m => m.values);
        console.log(chalk_1.default.green.bold("[Eagle BOT - Functions]") + chalk_1.default.magenta("Checking mutes peoples..."));
        for (const mute of mutesData) {
            const TimeRemaining = Math.round(new Date(mute.expiredAt).getTime() / 1000) - Math.round(Date.now() / 1000);
            if (TimeRemaining <= 15 * 60 * 1000) {
                setTimeout(() => {
                    const guildData = client.managers.guildsManager.getIfExist(mute.guildId);
                    if (!guildData)
                        return;
                    client.guilds.cache.get(mute.guildId).members.cache.get(mute.memberId).roles.remove(guildData.muteRoleId)
                        .then(() => {
                        client.users.cache.get(mute.memberId).send({
                            embeds: [
                                new discord_js_1.EmbedBuilder().setColor("Yellow")
                                    .setTimestamp().setDescription("Votre mute temporaire est terminé sur le serveur **" + client.guilds.cache.get(mute.guildId).name + "** !")
                            ]
                        }).catch();
                        client.managers.muteManager.getIfExist(`${mute.memberId}-${mute.guildId}`).delete();
                    }).catch();
                }, TimeRemaining * 1000);
            }
        }
    }
};
