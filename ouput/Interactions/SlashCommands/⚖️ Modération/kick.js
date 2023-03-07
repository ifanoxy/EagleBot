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
        .setName("kick")
        .setDescription("Vous permet d'expulser un membre du serveur.")
        .setDMPermission(false)
        .addUserOption(opt => opt.setName("utilisateur").setDescription("Choisissez l'utilisateur que vous souhaitez kick.").setRequired(true))
        .addStringOption(opt => opt.setName("raison").setDescription("La raison du kick pour se membre").setMaxLength(450)),
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberCible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
            const memberExecutor = interaction.guild.members.cache.get(interaction.user.id);
            if (!client.func.mod.memberKicable(memberCible, memberExecutor, interaction))
                return;
            memberCible.kick(`Demandé par ${interaction.user.tag} (${interaction.user.id}) | ` + interaction.options["getString"]("raison") || "pas de raison")
                .then(kickMember => {
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(Embed_1.DiscordColor.Eagle)
                            .setDescription(`Le membre ${kickMember.user.tag} (<@${kickMember.id}>) a été kick avec succès !\n\nraison: \`${interaction.options["getString"]("raison") || 'Pas de raison'}\``)
                            .setTimestamp()
                    ]
                });
                let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
                executorData.moderation.kick++;
                executorData.save();
            })
                .catch(reason => {
                interaction.reply({
                    embeds: [
                        {
                            description: `Il y a eu une erreur lors de l'expulsion du membre !\n\nErreur : \`${reason}\``,
                            color: Embed_1.DiscordColor.Red
                        }
                    ],
                    ephemeral: true
                });
            });
        });
    }
};
