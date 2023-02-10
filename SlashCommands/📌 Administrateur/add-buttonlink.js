const { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("add-buttonlink")
    .setDescription("Ajout un bouton qui envoie vers un lien au message supérieur")
    .setDMPermission(false)
    .addStringOption(
        opt => opt.setName("url").setDescription("Le lien du bouton").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        try {
            interaction.channel.messages.fetch({limit: 1, cache: true})
            .then(message => {
                if (message.first()?.editable) {
                    message.first().edit({
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel(new URL(interaction.options.getString("url")).hostname)
                                .setURL(interaction.options.getString("url"))
                            )
                        ]
                    }).catch(() => {});
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle("Boutton ajouté avec succès !")
                        ],
                        ephemeral: true,
                    })
                } else {
                    interaction.channel.createWebhook({
                        name: message.first().author.username,
                        avatar: message.first().author.avatarURL() || client.user.avatarURL(),
                        reason: "Ajout d'un bouton avec un lien"
                    })
                    .then(webhook => {
                        webhook.send({
                            content: message.first().content,
                            embeds: message.first().embeds || [],
                            files: message.first().attachments.map(x => x) || [],
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(new URL(interaction.options.getString("url")).hostname)
                                    .setURL(interaction.options.getString("url"))
                                )
                            ]
                        }).then(() => {
                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Boutton ajouté avec succès !")
                                ],
                                ephemeral: true,
                            });
                            message.first().delete().catch(() => {});
                            webhook.delete().catch(() => {});
                        }).catch(() => {
                            webhook.delete().catch(() => {});
                        })
                        
                    }).catch(() => {});
                }
            });
        } catch {}
    }
}