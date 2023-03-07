"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Permet d'ajouter un slow mode au channel actuel")
        .setDMPermission(false)
        .addIntegerOption(opt => opt.setName("délai").setDescription("le délai entre chaque message").setRequired(true).addChoices({ name: "Retirer", value: 0 }, { name: "5 Secondes", value: 5 }, { name: "10 Secondes", value: 10 }, { name: "15 Secondes", value: 15 }, { name: "30 Secondes", value: 30 }, { name: "1 Minute", value: 60 }, { name: "2 Minutes", value: 120 }, { name: "5 Minutes", value: 300 }, { name: "10 Minutes", value: 600 }, { name: "15 Minutes", value: 900 }, { name: "30 Minutes", value: 1800 }, { name: "1 Heure", value: 3600 }, { name: "2 Heures", value: 7200 }, { name: "6 Heures", value: 21600 })),
    execute(interaction) {
        if (interaction.channel.type == discord_js_1.ChannelType.GuildStageVoice)
            return interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder().setDescription("Vous ne pouvez pas utiliser cette commande dans ce channel !").setColor("Red")
                ],
                ephemeral: true
            });
        interaction.channel.setRateLimitPerUser(interaction.options.getInteger("délai"));
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle("Vous avez changer le slowmode de ce channel pour `" + new Date(interaction.options.getInteger("délai") * 1000).toISOString().slice(11, 19) + "`  ")
                    .setColor(Embed_1.DiscordColor.Eagle)
            ]
        });
    }
};
