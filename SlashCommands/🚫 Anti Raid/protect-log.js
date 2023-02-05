const { SlashCommandBuilder, ChannelType, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("protect-log")
    .setDescription("Channel où sera envoyer les alertes de protection")
    .addSubcommand(
        sub => sub.setName("set").setDescription("Permet de définir le channel des logs")
        .addChannelOption(
            opt => opt.setName("channel").setDescription("le channel où seront envoyés les alertes").addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
    )
    .addSubcommand(
        sub => sub.setName("remove").setDescription('Permet de retirer le channel des logs')
    )
    ,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!client.moderation.checkOwner(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être owner pour utiliser cette commande !")
            ],
            ephemeral: true
        });
        
        const sub = interaction.options.getSubcommand();

        if (sub == "set") {
            const channel = interaction.options.getChannel("channel");
            let database = client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId});
            database.log = channel.id;
            database.save();
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous venez d'ajouter un salon pour les alertes de protection")
                    .setDescription(`les alertes de protection (ou d'anti raid) seront envoyé ici --> ${channel}`)
                    .setColor("Blurple")
                ]
            })
        } else {
            let database = client.managers.antiraidManager.getIfExist(interaction.guildId);
            if (database) {
                if (database.log) {
                    database.log =  null
                    database.save()
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle("Vous avez retiré le channel des alertes de protection")
                            .setColor("Blurple")
                        ]
                    })
                }
            }

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Il n'y a pas de channel des alertes pour les protections")
                    .setColor("Red")
                ],
                ephemeral: true
            })
        }
    }
}