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
        .setName("hide")
        .setDescription("Vous permet d'enlever la permission d'un rôle de voir le channel")
        .setDMPermission(false)
        .addRoleOption(opt => opt.setName("role").setDescription("le rôle dont vous souhaitez cacher le channel").setRequired(false)),
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const role = interaction.guild.roles.cache.get((_a = interaction.options.getRole("role")) === null || _a === void 0 ? void 0 : _a.id) || interaction.guild.roles.everyone;
            const channel = interaction.channel;
            if (channel.permissionsFor(role).has("ViewChannel")) {
                if (channel.type == discord_js_1.ChannelType.GuildText) {
                    channel.permissionOverwrites.edit(role, {
                        ViewChannel: false
                    }).then(() => {
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor(Embed_1.DiscordColor.Eagle)
                                    .setDescription(`Ce channel a été hide par \`${interaction.user.tag}\` ${role.name == "@everyone" ? "" : `pour le rôle <@&${role.id}>`}`)
                            ]
                        });
                    }).catch((err) => {
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription(`Il y a eu une erreur pour cacher ce channel !\n\nErreur: ${err}`)
                            ],
                            ephemeral: true
                        });
                    });
                }
            }
            else {
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setDescription(`**Ce channel est déjà cacher pour se rôle !**\nVoulez vous show ? --> ${client.func.utils.slashCommandSend("show")}`)
                            .setColor("Red")
                    ],
                    ephemeral: true
                });
            }
        });
    }
};
