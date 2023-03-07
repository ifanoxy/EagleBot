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
        .setName("guild-list")
        .setDescription("vous permet d'avoir la liste des serveurs du bot"),
    execute(interaction, client) {
        let nameArray = [];
        let valueArray = [];
        Promise.all(client.guilds.cache.map((guild) => __awaiter(this, void 0, void 0, function* () {
            nameArray.push(guild.name);
            valueArray.push(`Owner: \`${(yield client.users.fetch(guild.ownerId)).tag}\`\nNombre membres: \`${guild.memberCount}\`\nCréation <t:${Math.round(guild.createdAt.getTime() / 1000)}:R>`);
        }))).then(() => {
            let guildEmbed = new discord_js_1.EmbedBuilder()
                .setTitle(`Liste des ${valueArray.length} serveurs du bot.`)
                .setColor(Embed_1.DiscordColor.DarkGreen);
            if (valueArray.length > 25) {
                client.func.utils.pagination(guildEmbed, nameArray, valueArray, interaction);
            }
            else {
                interaction.reply({
                    embeds: [
                        guildEmbed.setFields([...Array(valueArray.length).keys()].map(x => {
                            return {
                                name: nameArray[x],
                                value: valueArray[x],
                                inline: true
                            };
                        }))
                    ]
                });
            }
        }).catch(err => client.error(`Guild-list : ${err}`));
    }
};
