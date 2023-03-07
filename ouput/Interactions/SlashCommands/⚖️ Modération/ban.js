"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ban")
        .setDescription("Vous permet de bannir un utilisateur")
        .setDMPermission(false)
        .addUserOption(opt => opt.setName("utilisateur").setDescription("Saisissez l'utilisateur que vous souhaitez bannir").setRequired(true))
        .addStringOption(opt => opt.setName("raison").setDescription("La raison pour la quelle vous souhaitez bannir ce membre").setMaxLength(450))
        .addIntegerOption(opt => opt.setName("supprimer-messages").setDescription("Si vous souhaitez supprimer les messages du membre").addChoices({ name: "30 secondes", value: 30 }, { name: "5 minutes", value: 300 }, { name: "30 minutes", value: 1800 }, { name: "2 heures", value: 7200 }, { name: "12 heures", value: 43200 }, { name: "1 jour", value: 86400 }, { name: "2 jours", value: 172800 }, { name: "4 jours", value: 345600 }, { name: "7 jours", value: 604800 })),
    execute(interaction, client) {
        const memberCible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
        const memberExecutor = interaction.guild.members.cache.get(interaction.user.id);
        if (!client.func.mod.memberBannable(memberCible, memberExecutor, interaction))
            return;
        memberCible.ban({
            reason: `Demandé par ${interaction.user.tag} (${interaction.user.id}) | ` + interaction.options.getString("raison") || "pas de raison",
            deleteMessageSeconds: interaction.options.getInteger("supprimer-messages") || null,
        })
            .then(BanMember => {
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(Embed_1.DiscordColor.Eagle)
                        .setDescription(`Le membre ${BanMember.user.tag} (<@${BanMember.id}>) a été banni(e) avec succès !\n\nraison: \`${interaction.options["getString"]("raison") || 'Pas de raison'}\``)
                        .setTimestamp()
                ]
            });
            let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
            executorData.moderation.ban++;
            executorData.save();
        })
            .catch(reason => {
            interaction.reply({
                embeds: [
                    {
                        description: `Il y a eu une erreur lors du bannissement du membre !\n\nErreur : \`${reason}\``,
                        color: Embed_1.DiscordColor.Red
                    }
                ],
                ephemeral: true
            });
        });
    }
};
