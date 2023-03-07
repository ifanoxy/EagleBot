"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("clear")
        .setDescription("Vous permet de supprimer des messages dans ce channel")
        .setDMPermission(false)
        .addIntegerOption(opt => opt.setName("nombre-messages").setDescription("Le nombre de message que vous souhaitez supprimer").setMaxValue(100).setRequired(true)),
    execute(interaction, client) {
        if (interaction.channel.type == discord_js_1.ChannelType.GuildStageVoice)
            return interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder().setDescription("Vous ne pouvez pas utiliser cette commande dans ce channel !").setColor("Red")
                ],
                ephemeral: true
            });
        interaction.channel.bulkDelete(interaction.options.getInteger("nombre-messages"), true)
            .then(DeleteMessages => {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(Embed_1.DiscordColor.Eagle)
                        .setDescription(`Le membre ${interaction.user.tag} (<@${interaction.user.id}>) vient de supprimer \`${DeleteMessages.size}\` messages !`)
                        .setTimestamp()
                ]
            });
            let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
            executorData.moderation.removedMessage += DeleteMessages.size;
            executorData.save();
        });
    }
};
