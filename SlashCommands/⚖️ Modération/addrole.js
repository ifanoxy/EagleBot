const { SlashCommandBuilder, CommandInteraction, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("add-role")
    .setDescription("Permet d'ajouter un rôle à un membre")
    .setDMPermission(false)
    .addUserOption(
        opt => opt.setName("membre").setDescription("le membre dont vous souhaitez ajouter le role").setRequired(true)
    )
    .addRoleOption(
        opt => opt.setName('role').setDescription('le role que vous souhaitez ajouter au membre').setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        const membre = interaction.guild.members.cache.get(interaction.options.getUser("membre").id);
        const role = interaction.options.getRole("role");

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        if (membre.roles.highest.rawPosition >= role.rawPosition) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas ajouter un rôle supérieur ou égal au votre !")
            ],
            ephemeral: true
        });

        membre.roles.add(role.id)
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`Vous avez ajouté le role <@${role.id}> à <@${membre.id}> avec succès !`)
                ]
            });
        })
        .catch(err => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Il y a eu une erreur lors de l'ajout du rôle !\n\nErreur : ${err}`)
                ],
                ephemeral: true
            });
        })
    }
}