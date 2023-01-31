const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick un utilisateur du discord")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez expulser").setRequired(true)
    )
    .addStringOption(
        option => option.setName("raison").setDescription("Permet de définir la raison du kick de la personne.").setRequired(false)
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
        const cible = interaction.options.getMember("utilisateur")
        if (!cible.kickable) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Je ne peux pas kick cette personne !")
            ],
            ephemeral: true
        });
        if (Number(cible.permissions) > Number(executor.permissions)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas kick cette personne !")
            ],
            ephemeral: true
        });

        const reponsekick = cible.kick(`${executor.user.tag} | ${interaction.options.getString('raison') ? interaction.options.getString('raison') : "pas de raison"}`)
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setDescription(`\`${cible.nickname}\` a été kick par <@${executor.id}>`)
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
                    .setDescription("Il y a eu un problème lors du kick !")
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
        memberData.moderation.kick++;
        memberData.save();
    }
}