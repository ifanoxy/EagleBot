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
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Vous permet de rendre la parole à un membre mute")
        .setDMPermission(false)
        .addStringOption(option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez unmute").setRequired(true).setAutocomplete(true)),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused();
            let choices = [];
            client.managers.muteManager.map(mute => {
                if (mute.guildId != interaction.guildId)
                    return;
                choices.push({
                    username: interaction.guild.members.cache.get(mute.memberId).user.tag,
                    id: mute.memberId,
                    reason: mute.reason,
                });
            });
            const filtered = choices.filter(choice => choice.username.startsWith(focusedValue) || choice.id.startsWith(focusedValue) || choice.reason.startsWith(focusedValue));
            let options;
            if (filtered.length > 25) {
                options = filtered.slice(0, 25);
            }
            else {
                options = filtered;
            }
            yield interaction.respond(options.map(choice => ({ name: `${choice.username} (${choice.id}) --> ${choice.reason}`, value: choice.id })));
        });
    },
    execute(interaction, client) {
        const muteId = interaction.options.getString("utilisateur");
        let muteData = client.managers.muteManager.getIfExist(`${muteId}-${interaction.guildId}`);
        const guildData = client.managers.guildsManager.getIfExist(interaction.guildId);
        client.guilds.cache.get(interaction.guildId).members.cache.get(muteId).roles.remove(guildData.muteRoleId)
            .then(() => {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(Embed_1.DiscordColor.Eagle)
                        .setDescription(`Le membre <@${muteId}> a regagner la parole avec succès !`)
                        .setTimestamp()
                ]
            });
            muteData.delete();
        })
            .catch(() => {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("DarkRed")
                        .setDescription("Il y a eu un problème lors de la suppression du rôle !")
                ],
                ephemeral: true
            });
        });
        const channelLog = client.func.log.isActive(interaction.guildId, "Mute");
        if (channelLog)
            this.log(interaction, muteId, channelLog);
    },
    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Mute Remove`)
                    .setDescription(`**Membre Unmute:** <@${userId}>\n\n` +
                    `**Unmute par:** <@${interaction.user.id}>`)
            ]
        });
    }
};
