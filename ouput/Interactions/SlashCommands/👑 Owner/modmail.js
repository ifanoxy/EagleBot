"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("modmail")
        .setDescription("Permet de gérer le modmail du bot")
        .addSubcommand(sub => sub.setName("activer").setDescription("Permet d'activer le modMail sur le bot")
        .addChannelOption(opt => opt.addChannelTypes(discord_js_1.ChannelType.GuildText).setName("channel").setDescription("le channel").setRequired(true)))
        .addSubcommand(sub => sub.setName("désactiver").setDescription("Permet de désactiver le modMail sur le bot")),
    execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "activer":
                {
                    const channel = interaction.options.getChannel("channel");
                    client.config.modmailChannelId = channel.id;
                    client._fs.writeFileSync("./src/config.json", JSON.stringify(client.config, null, 2));
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor(Embed_1.DiscordColor.Eagle)
                                .setTitle("Vous avez activé le modmail")
                                .setDescription(`le modmail à été activé pour le channel \`${channel.name}\``)
                                .setTimestamp()
                        ]
                    });
                }
                break;
            case "désactiver":
                {
                    client.config.modmailChannelId = null;
                    client._fs.writeFileSync("./src/config.json", JSON.stringify(client.config, null, 2));
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor(Embed_1.DiscordColor.Eagle)
                                .setTitle("Vous avez désactivé le modmail")
                                .setDescription(`le modmail à été désactiver avec succès !`)
                                .setTimestamp()
                        ]
                    });
                }
                break;
        }
    }
};
