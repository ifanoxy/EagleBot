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
        .setName("unban")
        .setDescription("Vous permet de débanir un membre du serveur")
        .setDMPermission(false)
        .addStringOption(opt => opt.setName("utilisateur").setDescription("sélectionné l'utilisateur que vous souhaitez débannir").setRequired(true).setAutocomplete(true)),
    autocomplete(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused();
            let choices = [];
            const bans = yield interaction.guild.bans.fetch();
            bans.map(ban => choices.push({
                name: ban.user.tag,
                id: ban.user.id
            }));
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue) || choice.id.startsWith(focusedValue));
            let options;
            if (filtered.length > 25) {
                options = filtered.slice(0, 25);
            }
            else {
                options = filtered;
            }
            yield interaction.respond(options.map(choice => ({ name: `${choice.name} | ${choice.id}`, value: choice.id })));
        });
    },
    execute(interaction) {
        const unbanId = interaction.options.getString("utilisateur");
        interaction.guild.bans.remove(unbanId, `Demandé par ${interaction.user.tag} (${interaction.user.id})`)
            .then(user => {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("Green").setDescription(`L'utilisateur \`${user.tag}\` à été débanni du serveur par <@${interaction.user.id}> !`)
                ]
            });
        })
            .catch((err) => {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("Orange").setDescription(`Il y a eu un problème lors du bannissement : ${err}`)
                ],
                ephemeral: true
            });
        });
    }
};
