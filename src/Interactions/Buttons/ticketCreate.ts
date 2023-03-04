import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder, PermissionsBitField
} from "discord.js";
import {EagleClient} from "../../structures/Client";

export default {
    execute(interaction: ButtonInteraction, client: EagleClient) {
        const categorieId = interaction.customId.split('#')[1]

        interaction.guild.channels.create({
            name: `${interaction.user.username}-${interaction.component.label}`,
            topic: interaction.user.id,
            parent: categorieId,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
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
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setLabel("Fermer le ticket")
                                .setCustomId("ticketClose")
                                .setEmoji("🔒")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                })
            })
    }
}