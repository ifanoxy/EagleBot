const { ButtonBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonStyle, ComponentType, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("purge-channels")
    .setDescription("Permet de supprimer tout les channels d'un serveur discord")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!client.moderation.checkWhitelist(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être whitelist pour utiliser cette commande !")
            ],
            ephemeral: true
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Confirmation")
                .setDescription("Vous êtes sur de vouloir supprimer **l'entièreté** des channels de ce serveur ?")
                .setFooter({text: "Vous avez 30s pour répondre"})
                .setColor("Red")
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]yes")
                    .setLabel("Oui")
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId("[no-check]no")
                    .setLabel("Non")
                    .setStyle(ButtonStyle.Danger)
                )
            ],
            ephemeral: true
        })
        .then(msg => {
            msg.awaitMessageComponent({
                filter: i => i.customId == "[no-check]yes" || i.customId == "[no-check]no",
                componentType: ComponentType.Button,
                time: 30 * 1000
            })
            .then(inter => {
                inter.update({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Suppression de tout les channels")
                        .setColor("Green")
                        .setDescription('Cette opération peut prendre un certain temps.')
                    ]
                }).then(() => {
                    interaction.guild.channels.cache.map(channel => {
                        channel.delete("Purge channel command | demandé par :" + interaction.user.tag).catch(() => {client.error(err)})
                    })
                })
            })
            .catch(reason => {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Confirmation")
                        .setDescription("Vous êtes sur de vouloir supprimer **l'entièreté** des channels de ce serveur ?")
                        .setFooter({text: "Vous avez 30s pour répondre"})
                        .setColor("Red")
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setCustomId("[no-check]yes")
                            .setLabel("Oui")
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                            .setCustomId("[no-check]no")
                            .setLabel("Non")
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Danger)
                        )
                    ],
                    ephemeral: true
                })
            })
        })
    }
}