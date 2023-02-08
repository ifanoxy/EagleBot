const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Permet d'exclure un membre temporairement")
    .setDMPermission(false)
    .addUserOption(
        opt => opt.setName("utilisateur").setDescription("Définissez l'utilisateur que vous voulez timeout").setRequired(true)
    )
    .addStringOption(
        opt => opt.setName('temps').setDescription("Le temps d'exclusion (ex: 2h 15min 17s)").setRequired(true)
    )
    .addStringOption(
        opt => opt.setName("raison").setDescription("La raison de cette sanction")
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
        member.timeout(ms(interaction.options.getString("temps")), `Sanctionné par ${interaction.user.tag} | ` + (interaction.options.getString("raison") || "pas de raison")).then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("LightGrey")
                    .setTimestamp()
                    .setDescription(`Le membre <@${interaction.options.getUser("utilisateur").id}> à été exclus pendant \`${interaction.options.getString("temps")}\``)
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