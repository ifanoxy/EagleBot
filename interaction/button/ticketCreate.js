const { CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const categorieId = interaction.customId.split('#')[1]
        
        interaction.guild.channels.create({
            name: `${interaction.user.username}-${interaction.component.label}`,
            parent: categorieId
        })
        .then(channel => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Ticket créer avec succès !")
                    .setDescription(`Votre ticket est disponible ici --> <#${channel.id}>`)
                ],
                ephemeral: true
            })
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Nouveau ticket de ${interaction.user.username}`)
                    .setDescription(`Vous avez créer ce ticket pour la raison : ${interaction.component.label}.`)
                    .setColor("DarkGold")
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setLabel("Fermer le ticket")
                        .setCustomId("ticketClose")
                        .setStyle(ButtonStyle.Danger)
                    )
                ]
            })
        })
    }
}