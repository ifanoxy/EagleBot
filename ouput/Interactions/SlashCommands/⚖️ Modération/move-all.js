"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("move-all")
        .setDescription("Permet de déplacer tout les membres dans un channel")
        .setDMPermission(false)
        .addChannelOption(opt => opt.setName("channel").setDescription("Sélectionner le channel où vous voulez déplacer les membres").addChannelTypes(discord_js_1.ChannelType.GuildVoice)),
    execute(interaction) {
        var _a, _b, _c;
        const channelId = ((_a = interaction.options.getChannel("channel")) === null || _a === void 0 ? void 0 : _a.id) || ((_c = (_b = interaction.guild.members.cache.get(interaction.user.id)) === null || _b === void 0 ? void 0 : _b.voice) === null || _c === void 0 ? void 0 : _c.channelId);
        if (!channelId)
            return interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setDescription("Vous devez être dans un channel vocal ou en définir un")
                        .setColor("Red")
                ],
                ephemeral: true
            });
        interaction.guild.voiceStates.cache.map(member => {
            member.setChannel(channelId, `Demandé par ${interaction.user.tag} (${interaction.user.id}) | Move-all`).catch();
        });
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(Embed_1.DiscordColor.Eagle)
                    .setDescription(`Le membre \`${interaction.user.tag}\` a déplacer **${interaction.guild.voiceStates.cache.size}** membres dans le channel <#${channelId}>`)
            ]
        });
    }
};
