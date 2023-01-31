const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Permet de jouer une musique")
    .addStringOption(
        opt => opt.setName("name-url").setDescription("entrez le nom de la musique ou l'URL").setRequired(true)
    ),
    async execute(interaction, client) {
        const musique = interaction.options.getString("name-url");

        if (!client.music.checkInVoice(interaction.member))return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Vous devez êtes dans un salon vocal !")
                .setColor("Red")
            ],
            ephemeral: true,
        })

        client.music.play(interaction.member.voice.channel, musique, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Vous venez d'ajouter une musique à la playlist !")
                .setTimestamp()
                .setFooter({text: `Demandé par ${interaction.user.tag}`})
                .setColor("White")
            ]
        })
    }
}