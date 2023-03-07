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
        .setName("commands-perms")
        .setDescription("Vous permet de modifier les permissions des commandes")
        .setDMPermission(false)
        .addSubcommand(sub => sub.setName("modifier").setDescription("vous permet de modifier la permission d'une commande")
        .addStringOption(opt => opt.setName("commande").setDescription("La commande que vous souhaitez modifier").setRequired(true).setAutocomplete(true))
        .addStringOption(opt => opt.setName("permission").setDescription("la nouvelle permission pour utiliser cette commande").setRequired(true).setAutocomplete(true)))
        .addSubcommand(sub => sub.setName("list").setDescription("Vous permet de voir toute les permissions de toute les commandes")),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused(true);
            if (focusedValue.name == "commande") {
                const perms = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId }).permissions;
                const choices = client.application.commands.cache.map(x => ({ name: `${x.name} | ${typeof perms[x.name] == "string" ? perms[x.name] : new discord_js_1.PermissionsBitField(BigInt(perms[x.name])).toArray()[0]}`, value: x.name }));
                const filtered = choices.filter(choice => choice.name.toLocaleLowerCase().includes(focusedValue.value.toLocaleLowerCase())).slice(0, 25);
                yield interaction.respond(filtered.map(choice => ({ name: choice.name, value: choice.value })));
            }
            else {
                const permissions = Object.keys(discord_js_1.PermissionsBitField.Flags).map(x => ({ name: x, value: String(discord_js_1.PermissionsBitField.Flags[x]) }));
                const choices = [
                    {
                        name: "owner", value: "owner"
                    }, {
                        name: "whitelist", value: "whitelist"
                    }
                ].concat(permissions);
                const filtered = choices.filter(choice => choice.name.toLocaleLowerCase().includes(focusedValue.value.toLocaleLowerCase())).slice(0, 25);
                yield interaction.respond(filtered.map(choice => ({ name: choice.name, value: choice.value })));
            }
        });
    },
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let GuildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
            if (interaction.options.getSubcommand() == "modifier") {
                const commandName = interaction.options.getString('commande');
                const permission = interaction.options.getString("permission");
                if (!Number.isNaN(Number(permission))) {
                    GuildData.permissions[commandName] = Number(permission);
                }
                else {
                    GuildData.permissions[commandName] = permission;
                }
                ;
                GuildData.save();
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(Embed_1.DiscordColor.Eagle)
                            .setDescription(`\`${interaction.user.tag}\` vient de changer les permissions de la commande **${commandName}**.\nNouvelle Permission : \`${typeof GuildData.permissions[commandName] == "string" ? permission : new discord_js_1.PermissionsBitField(BigInt(permission)).toArray()[0]}\``)
                            .setTimestamp()
                    ]
                });
            }
            else {
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(Embed_1.DiscordColor.Eagle)
                            .setTitle(`Voici la liste des permissions des ${client.application.commands.cache.size} commandes`)
                            .setDescription(client.application.commands.cache.map(cmd => `${cmd.name} -> \`${typeof GuildData.permissions[cmd.name] == "string" ? GuildData.permissions[cmd.name] : new discord_js_1.PermissionsBitField(BigInt(GuildData.permissions[cmd.name])).toArray()[0]}\``).join("\n"))
                            .setTimestamp()
                    ]
                });
            }
        });
    }
};
