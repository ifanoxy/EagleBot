const { SlashCommandBuilder, PermissionsBitField, CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("vkick")
    .setDescription("Permet de déconnecter un membre d'un salon vocal")
    .setDMPermission(false)
    .addUserOption(
        opt => opt.setName("membre").setDescription("Le membre que vous souhaitez kick du vocal").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        const user = interaction.options.getUser("membre");

        if (interaction.member.permissions.bitfield < interaction.guild.members.cache.get(user.id).permissions.bitfield)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Vous avez une permission moins élévée que le membre que vous souhaitez kick.`)
            ],
            ephemeral: true
        })

        if (! interaction.guild.members.cache.get(user.id).voice.channel)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Le membre <@${user.id}> n'est pas dans un channel vocal !`)
            ],
            ephemeral: true
        })
        interaction.guild.members.cache.get(user.id).voice.disconnect(`Déconnecté par ${interaction.user.tag}`)
        .then((a) => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`Le membre <@${user.id}> a été déconnecté du channel vocal !`)
                ],
                ephemeral: true
            })
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Il y a eu un problème lors du kick vocal de ce membre`)
                ],
                ephemeral: true
            })
        })
    }
}