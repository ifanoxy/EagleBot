const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("enlever un avertissement un utilisateur du serveur discord")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("utilisateur").setDescription("définissez l'utilisateur dont vous souhaitez enlever un avertissement").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const cible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id)
        if (Number(cible.permissions) > Number(executor.permissions)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas avertir cette personne !")
            ],
            ephemeral: true
        })

        const cibledata = await client.managers.membersManager.getAndCreateIfNotExists(executor.id, {
            memberId: executor.id,
        })
        if (!cibledata.moderation.warn > 0)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Cette personne a aucun avertissement !")
            ],
            ephemeral: true
        });
        cibledata.moderation.warn--;

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("DarkOrange")
                .setDescription(`\`<@${cible.id}>\` vient de prendre un avertissement de la part de <@${executor.id}>`)
                .setTimestamp()
            ]
        });
        cibledata.save();
    }
}