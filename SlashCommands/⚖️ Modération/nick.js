const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription("Changer le surnom d'un membre")
    .setDMPermission(false)
    .addUserOption(
        opt => opt.setName("utilisateur").setDescription("l'utilisateur que vous souhaitez renommer").setRequired(true)
    )
    .addStringOption(
        opt => opt.setName("new-name").setDescription("le nouveau pseudo du membre `null` pour retirer").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const member = interaction.options.getUser("utilisateur");
        const newNick = interaction.options.getString('new-name');

        if (newNick == "null")
        {
            interaction.guild.members.cache.get(member.id).setNickname(null, `Demandé par ${interaction.user.tag}`);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`Le nick de <@${member.id}> a été réinitialisé.`)
                    .setColor("Red")
                ]
            });
        } 
        else
        {
            interaction.guild.members.cache.get(member.id).setNickname(newNick, `Demandé par ${interaction.user.tag}`);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`Le nick de <@${member.id}> a été changé pour \`${newNick}\.`)
                    .setColor("Green")
                ]
            });
        }
    }
}