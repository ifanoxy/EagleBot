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
        .setName("role-everyone")
        .setDescription("Permet d'ajouter un rôle à tout les membres")
        .setDMPermission(false)
        .addRoleOption(option => option.setName("role").setDescription('définissez le rôle qui sera attribué à tout le monde').setRequired(true)),
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = interaction.options.getRole("role");
            if ((yield interaction.guild.members.fetch(interaction.user.id)).roles.highest.position <= role.position)
                return interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor('Red')
                            .setDescription("Vous n'avez pas la permission d'ajouter ce rôle !")
                    ],
                    ephemeral: true
                });
            const members = yield interaction.guild.members.fetch();
            let nbr = 0;
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Aqua")
                        .setTitle(`Ajout du rôle ${role.name} à tout le monde`)
                        .setDescription(`rôle donné à \`${nbr}\` personne`)
                        .setTimestamp()
                        .setFooter({ text: "cette action peut prendre plusieurs minutes" })
                ]
            })
                .then(() => {
                members.map(m => {
                    const a = m.roles.add(role.id);
                    nbr++;
                    if (nbr % 10 == 0 && nbr != members.size)
                        return;
                    else
                        a.then(() => {
                            interaction.editReply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor("Aqua")
                                        .setTitle(`Ajout du rôle ${role.name} à tout le monde`)
                                        .setDescription(`rôle donné à \`${nbr}\` personnes`)
                                        .setTimestamp()
                                        .setFooter({ text: "cette action peut prendre plusieurs minutes" })
                                ]
                            });
                        })
                            .catch(() => { });
                });
            });
        });
    }
};
