const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("move-all")
    .setDescription("Permet de déplacer tout les membres de channel vocal")
    .setDMPermission(false)
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
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        const moveChannel = interaction.options.getChannel("channel") || interaction.member.voice?.channel;

        if (!moveChannel)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Vous devez être dans un channel vocal ou définir un channel pour déplacer le membre vers celui-ci`)
            ],
            ephemeral: true
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Orange")
                .setDescription("Déplacement en cours des `"+interaction.guild.voiceStates.cache.size+"` membres en vocal")
            ],
            ephemeral: true
        })

        interaction.guild.voiceStates.cache.map(user => {
            user.setChannel(moveChannel.id, `Déplacé par ${interaction.user.tag}`)
        })
    }
}