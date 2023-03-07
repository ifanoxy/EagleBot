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
        .setName("unwarn")
        .setDescription("Vous permet de supprimer un warn d'un membre")
        .setDMPermission(false)
        .addUserOption(opt => opt.setName('utilisateur').setDescription("l'utilisateur que vous souhaitez unwarn").setRequired(true))
        .addStringOption(opt => opt.setName("warn").setDescription("le warn que vous souhaitez supprimer").setRequired(true).setAutocomplete(true)),
    autocomplete(interaction, client) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const focus = interaction.options.getFocused();
            const userId = (_a = interaction.options.get("utilisateur")) === null || _a === void 0 ? void 0 : _a.value.toString();
            const choices = ((_b = client.managers.membersManager.getIfExist(userId)) === null || _b === void 0 ? void 0 : _b.values.warn.map(x => x.reason).concat("All")) || ["Ce membre n'a aucun warn !"];
            const filtered = choices.filter(choice => choice.startsWith(focus));
            let options;
            if (filtered.length > 25) {
                options = filtered.slice(0, 25);
            }
            else {
                options = filtered;
            }
            yield interaction.respond(options.map(c => ({ name: c, value: c })));
        });
    },
    execute(interaction, client) {
        const warn = interaction.options.getString("warn");
        if (warn == "Ce membre n'a aucun warn !")
            return interaction.reply({
                embeds: [{
                        color: Embed_1.DiscordColor.DarkPurple,
                        description: "Ce membre n'a pas de warn, vous ne pouvez donc pas lui en retirer"
                    }],
                ephemeral: true
            });
        const user = interaction.options.getUser("utilisateur");
        let userData = client.managers.membersManager.getIfExist(user.id);
        if (userData.warn.length == 1 || warn == "All")
            userData.delete();
        else {
            userData.warn = userData.warn.filter(x => x.reason != warn);
            userData.save();
        }
        interaction.reply({
            embeds: [
                {
                    description: `Vous avez retiré avec succès un warn de <@${user.id}>.\n\nRaison du warn: \`${warn}\``,
                    color: Embed_1.DiscordColor.Eagle,
                }
            ]
        });
        const channelLog = client.func.log.isActive(interaction.guildId, "Warn");
        if (channelLog)
            this.log(interaction, user.id, channelLog);
    },
    log(interaction, userId, channel) {
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Warn Remove`)
                    .setDescription(`**Membre Unwarn:** <@${userId}>\n\n` +
                    `**Unwarn par:** <@${interaction.user.id}>`)
            ]
        });
    }
};
