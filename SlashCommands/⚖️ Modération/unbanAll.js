const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unbanall")
    .setDescription("débannir tout les utilisateurs du serveur discord")
    .setDMPermission(false)
    .addStringOption(
        option => option.setName("raison").setDescription("Permet de définir la raison du débannissement.").setRequired(false)
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
        let listeUnban = []
        interaction.guild.bans.cache.map(ban => {
            console.log(ban)
            interaction.guild.bans.remove(ban.user.id).catch(()=>{})
            listeUnban.push(ban.user.username)
        })
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("DarkOrange")
                .setDescription(`<@${executor.id}> vient de débannir \`${listeUnban.length}\` personne :\n> ${listeUnban.join('\n > ')}`)
                .setTimestamp()
            ]
        });

        const memberData = await client.managers.membersManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
            memberId: executor.id,
        })
        memberData.moderation.ban++;
        memberData.save();
    }
}