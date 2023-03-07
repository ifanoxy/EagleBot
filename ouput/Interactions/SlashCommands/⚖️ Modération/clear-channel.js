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
        .setName("clear-channel")
        .setDescription("Supprimer un channel et le recréer")
        .setDMPermission(false)
        .addChannelOption(opt => opt.setName("channel").setDescription("le channel que vous souhaitez clear").addChannelTypes(discord_js_1.ChannelType.GuildText).setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield interaction.guild.channels.fetch(interaction.options.getChannel("channel").id, { force: true, cache: true });
            if (channel.type == discord_js_1.ChannelType.GuildText) {
                channel.delete(`Demandé par ${interaction.user.tag} (${interaction.user.id}) | Clear Channel`).then(() => {
                    var _a;
                    interaction.guild.channels.create({
                        name: channel.name,
                        reason: `Demandé par ${interaction.user.tag} (${interaction.user.id}) | Clear Channel`,
                        topic: channel.topic,
                        permissionOverwrites: channel.permissionOverwrites.cache,
                        parent: (_a = channel.parent) === null || _a === void 0 ? void 0 : _a.id,
                        type: channel.type,
                        position: channel.rawPosition,
                        rateLimitPerUser: channel.rateLimitPerUser,
                        nsfw: channel.nsfw,
                    })
                        .then(chan => {
                        if (interaction.isRepliable()) {
                            interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor("Blurple")
                                        .setDescription(`Le channel \`${channel.name}\` à été supprimer et recréer <#${chan.id}>`)
                                        .setTimestamp()
                                ],
                                ephemeral: true
                            });
                        }
                        chan.send({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor("Green")
                                    .setDescription(`Ce channel a été supprimer et recréer par \`${interaction.user.tag}\``)
                                    .setTimestamp()
                            ]
                        });
                    });
                });
            }
        });
    }
};
