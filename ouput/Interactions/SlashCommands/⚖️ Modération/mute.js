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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("mute")
        .setDescription("Vous permet de rendre muet un membre du serveur")
        .setDMPermission(false)
        .addUserOption(option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez mute").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("Permet de définir la raison du mute de la personne.").setRequired(false).setMaxLength(450))
        .addStringOption(option => option.setName("temps").setDescription("le temps du mute (w -> semaine | d -> jour | m -> minute, etc) ").setRequired(false)),
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const cible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
            interaction.deferReply().then(() => {
                client.func.mod.muteUser({
                    userId: cible.id,
                    guildId: interaction.guildId,
                    executor: interaction.user.tag,
                    raison: interaction.options.getString('raison') || "pas de raison",
                    time: interaction.options.getString("temps") ? (0, ms_1.default)(interaction.options.getString("temps")) : Infinity,
                })
                    .then(() => {
                    interaction.editReply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor(Embed_1.DiscordColor.Eagle)
                                .setDescription(`Le membre ${cible.user.tag} (<@${cible.id}>) a été rendu Muet avec succès !\n\nTemps: \`${interaction.options.getString("temps") ? interaction.options.getString("temps") : Infinity}\`\nRaison: \`${interaction.options["getString"]("raison") || 'Pas de raison'}\``)
                                .setTimestamp()
                        ]
                    });
                    setTimeout(() => {
                        require("../../../functions/repeat/checkMutes").default.execute(client);
                    }, 3000);
                });
            });
            const memberData = yield client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
                memberId: interaction.user.id,
            });
            memberData.moderation.mute++;
            memberData.save();
            const channelLog = client.func.log.isActive(interaction.guildId, "Mute");
            if (channelLog)
                this.log(interaction, cible.id, channelLog, interaction.options.getString('raison') || "pas de raison"), interaction.options.getString("temps") ? (0, ms_1.default)(interaction.options.getString("temps")) : Infinity;
        });
    },
    log(interaction, userId, channel, raison, time) {
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Mute Add`)
                    .setDescription(`**Membre Mute:** <@${userId}>\n\n` +
                    `**Raison:** <@${raison}>\n\n` +
                    `**Temps:** <@${time}>\n\n` +
                    `**Mute par:** <@${interaction.user.id}>`)
            ]
        });
    }
};
