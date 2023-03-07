"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("warn")
        .setDescription("Vous permet de donner un avertissement à un membre")
        .setDMPermission(false)
        .addUserOption(opt => opt.setName("utilisateur").setDescription("L'utilisateur que vous souhaitez avertir").setRequired(true))
        .addStringOption(opt => opt.setName("raison").setDescription("La raison de l'avertissement de ce membre").setRequired(true).setMaxLength(450)),
    execute(interaction, client) {
        const member = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
        const raison = interaction.options.getString("raison", true);
        if (!client.func.mod.executorIsOverCible(member, interaction.guild.members.cache.get(interaction.user.id)))
            return interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas warn un membre qui est owner ou whitelist alors que vous non !`,
                        color: Embed_1.DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
        if (member.id == interaction.user.id)
            return interaction.reply({
                embeds: [
                    {
                        description: `Vous ne pouvez pas vous auto warn !`,
                        color: Embed_1.DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
        if (member.id == client.user.id)
            return interaction.reply({
                embeds: [
                    {
                        description: `Vous ne pouvez pas me warn !`,
                        color: Embed_1.DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
        let memberData = client.managers.membersManager.getAndCreateIfNotExists(member.id, { memberId: member.id });
        memberData.warn.push({
            userId: interaction.user.id,
            reason: raison,
            date: new Date(),
        });
        memberData.save();
        let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
        executorData.moderation.warn++;
        executorData.save();
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(Embed_1.DiscordColor.Eagle)
                    .setDescription(`Le membre ${member.user.tag} (<@${member.id}>) a été warn avec succès !\n\nraison: \`${raison}\``)
                    .setTimestamp()
            ]
        });
        const channelLog = client.func.log.isActive(interaction.guildId, "Warn");
        if (channelLog)
            this.log(interaction, member.id, channelLog, raison);
    },
    log(interaction, userId, channel, raison) {
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Warn Add`)
                    .setDescription(`**Membre Warn:** <@${userId}>\n\n` +
                    `**Raison:** <@${raison}>\n\n` +
                    `**Warn par:** <@${interaction.user.id}>`)
            ]
        });
    }
};
