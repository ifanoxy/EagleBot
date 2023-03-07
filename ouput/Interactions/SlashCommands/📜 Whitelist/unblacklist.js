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
    data: new discord_js_1.SlashCommandBuilder()
        .setName("unbl")
        .setDescription("Permet de unblacklist une personne du bot")
        .setDMPermission(false)
        .addStringOption(option => option.setName("utilisateur").setDescription("entrez la personne que vous shouaitez unblacklist").setRequired(true).setAutocomplete(true)),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused();
            let choices = client.managers.blacklistManager.map(x => x.userId);
            choices.unshift("all");
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            let options;
            if (filtered.length > 25) {
                options = filtered.slice(0, 25);
            }
            else {
                options = filtered;
            }
            yield interaction.respond(options.map(choice => ({ name: `${choice}`, value: choice })));
        });
    },
    execute(interaction, client) {
        const id = interaction.options.getString("utilisateur");
        if (id == "all") {
            client.managers.blacklistManager.map(x => {
                x.delete();
            });
        }
        else {
            client.managers.blacklistManager.getAndCreateIfNotExists(id, {
                userId: id,
            }).delete();
        }
        const channelLog = client.func.log.isActive(interaction.guildId, "BlackListUpdate");
        if (channelLog)
            this.log(interaction, id, channelLog);
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Vous avez unblacklist <@${id}>`)
            ]
        });
    },
    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Blacklist Remove`)
                    .setDescription(`**Membre Retiré:** <@${userId}>\n\n` +
                    `**Retiré par:** <@${interaction.user.id}>`)
            ]
        });
    }
};
