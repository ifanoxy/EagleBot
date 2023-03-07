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
        .setName("moveall")
        .setDescription("Permet de déplacer tout les membres de channel vocal")
        .setDMPermission(false)
        .addChannelOption(opt => opt.setName("channel").setDescription("ne pas définir pour déplacer dans votre channel").addChannelTypes(discord_js_1.ChannelType.GuildVoice).setRequired(false)),
    execute(interaction, client) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const moveChannel = interaction.options.getChannel("channel") || ((_b = (_a = (yield interaction.guild.members.fetch(interaction.user.id))) === null || _a === void 0 ? void 0 : _a.voice) === null || _b === void 0 ? void 0 : _b.channel);
            if (!moveChannel)
                return interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`Vous devez être dans un channel vocal ou définir un channel pour déplacer le membre vers celui-ci`)
                    ],
                    ephemeral: true
                });
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Orange")
                        .setDescription("Déplacement en cours des `" + interaction.guild.voiceStates.cache.size + "` membres en vocal")
                ],
                ephemeral: true
            });
            interaction.guild.voiceStates.cache.map(user => {
                user.setChannel(moveChannel.id, `Déplacé par ${interaction.user.tag}`).catch();
            });
        });
    }
};
