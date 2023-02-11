const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("mute un utilisateur de votre serveur discord")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez mute").setRequired(true)
    )
    .addStringOption(
        option => option.setName("raison").setDescription("Permet de définir la raison du mute de la personne.").setRequired(false)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.reply({
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
                .setDescription("Vous ne pouvez pas mute cette personne !")
            ],
            ephemeral: true
        });
        interaction.deferReply().then(() => {
            client.moderation.muteUser({
                userId: cible.id,
                guildId: interaction.guildId,
                executor: executor.user.tag,
                raison: interaction.options.getString('raison') || "pas de raison"
            })
            .then(() => {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("White")
                        .setDescription(`\`${cible.displayName}\` a été mute par <@${executor.id}>`)
                        .setTimestamp()
                    ]
                });
            })
        })

        const memberData = await client.managers.membersManager.getAndCreateIfNotExists(executor.id, {
            memberId: executor.id,
        })
        memberData.moderation.mute++;
        memberData.save();
    }
}