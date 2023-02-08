const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Permet de supprimler lexclusion d'un membre")
    .setDMPermission(false)
    .addUserOption(
        opt => opt.setName("utilisateur").setDescription("Définissez l'utilisateur que vous voulez untimeout").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        const member = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id);
        member.timeout(null, `un Timeout par ${interaction.user.tag}`).then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("LightGrey")
                    .setTimestamp()
                    .setDescription(`Le membre <@${interaction.options.getUser("utilisateur").id}> n'est plus exclus !`)
                ]
            })
        }).catch(err => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Une erreur est survenue !")
                    .setDescription("Erreur :" + err)
                ],
                ephemeral: true
            })
        })
    }
}