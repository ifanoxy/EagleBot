const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Permet de déplacer un membre de channel vocal")
    .setDMPermission(false)
    .addUserOption(
        opt => opt.setName("membre").setDescription("Le membre que vous souhaitez kick du vocal").setRequired(true)
    )
    .addChannelOption(
        opt => opt.setName("channel").setDescription("ne pas définir pour déplacer dans votre channel").addChannelTypes(ChannelType.GuildVoice).setRequired(false)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) return interaction.reply({
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

        const moveChannel = interaction.options.getChannel("channel") || interaction.member.voice?.channel;

        if (!interaction.guild.members.cache.get(user.id).voice.channel)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Le membre <@${user.id}> n'est pas dans un channel vocal !`)
            ],
            ephemeral: true
        });

        if (!moveChannel)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Vous devez être dans un channel vocal ou définir un channel pour déplacer le membre vers celui-ci`)
            ],
            ephemeral: true
        });

        if (interaction.guild.members.cache.get(user.id).voice.channelId == moveChannel)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Vous êtes déjà dans le même channel vocal que ce membre !`)
            ],
            ephemeral: true
        });

        interaction.guild.members.cache.get(user.id).voice.setChannel(moveChannel.id, `Déplacé par ${interaction.user.tag}`)
        .then((a) => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`Le membre <@${user.id}> a été déplacer avec succès !`)
                ],
                ephemeral: true
            })
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Il y a eu un problème lors du déplacement vocal de ce membre`)
                ],
                ephemeral: true
            })
        })
    }
}