const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("bannir un utilisateur du discord")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez bannir").setRequired(true)
    )
    .addStringOption(
        option => option.setName("raison").setDescription("Permet de définir la raison du banissement de la personne.").setRequired(false)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const cible = interaction.options.getMember("utilisateur")
        if (!cible.bannable) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Je ne peux pas bannir cette personne !")
            ],
            ephemeral: true
        });
        if (Number(cible.permissions) > Number(executor.permissions)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas bannir cette personne !")
            ],
            ephemeral: true
        });

        const reponsekick = cible.ban(`${executor.user.tag} | ${interaction.options.getString('raison') ? interaction.options.getString('raison') : "pas de raison"}`)
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setDescription(`\`${cible.nickname}\` a été banni par <@${executor.id}>`)
                    .setTimestamp()
                ]
            });
            return 1
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("Il y a eu un problème lors du bannissement !")
                ],
                ephemeral: true
            });
            return 0
        })
        if (!reponsekick)return

        const memberData = await client.managers.membersManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
            memberId: executor.id,
        })
        memberData.moderation.ban++;
        memberData.save();
    }
}