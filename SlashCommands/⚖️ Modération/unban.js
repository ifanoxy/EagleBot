const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("débannir un utilisateur du discord")
    .setDMPermission(false)
    .addStringOption(
        option => option.setName("utilisateur-id").setDescription("définissez l'utilisateur que vous souhaitez débannir").setRequired(true)
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
        const cible = interaction.options.getString("utilisateur-id")

        const reponsekick = interaction.guild.bans.remove(cible, `${executor.user.tag} | ${interaction.options.getString('raison') ? interaction.options.getString('raison') : "pas de raison"}`)
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setDescription(`\`${cible}\` a été débanni par <@${executor.id}>`)
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
                    .setDescription("Il y a eu un problème lors du débannissement !")
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