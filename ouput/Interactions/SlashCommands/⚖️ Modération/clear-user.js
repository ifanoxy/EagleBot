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
        .setName("clear-user")
        .setDescription("Supprimer les 100 derniers messages d'un utilisateur dans chaque channel")
        .setDMPermission(false)
        .addUserOption(opt => opt.setName("utilisateur").setDescription("L'utilisateur dont vous souhaitez supprimer les messages").setRequired(true)),
    execute(interaction, client) {
        const user = interaction.options.getUser('utilisateur');
        let embed = new discord_js_1.EmbedBuilder()
            .setColor("DarkGold")
            .setTitle("Supression des messages de " + user.tag)
            .setDescription("Nombre de messages supprimés : \`En cours\`");
        interaction.reply({
            embeds: [embed]
        }).then(() => {
            let nbrSup = 0;
            Promise.all(
            // @ts-ignore
            interaction.guild.channels.cache.filter(chn => chn.type == discord_js_1.ChannelType.GuildText).map((channel) => __awaiter(this, void 0, void 0, function* () {
                let messages = yield channel.messages.fetch({ limit: 100 });
                let userMessages = messages.filter((m) => m.author.id === user.id);
                return yield channel.bulkDelete(userMessages).then(() => {
                    nbrSup += userMessages.size;
                }).catch(err => { });
            }))).then(() => {
                if (user.id != client.user.id) {
                    interaction.editReply({
                        embeds: [embed.setDescription(`Nombre de messages supprimés : \`${nbrSup}\``)]
                    });
                }
                else {
                    if (interaction.channel.type != discord_js_1.ChannelType.GuildStageVoice) {
                        interaction.channel.send({
                            embeds: [embed.setDescription(`Nombre de messages supprimés : \`${nbrSup}\``)]
                        });
                    }
                }
                let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
                executorData.moderation.removedMessage += nbrSup;
                executorData.save();
            });
        });
    }
};
