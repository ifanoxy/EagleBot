import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction, EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("add-buttonlink")
        .setDescription("Ajout d'un bouton qui envoie vers un lien au message supérieur")
        .setDMPermission(false)
        .addStringOption(
            opt => opt.setName("url").setDescription("Le lien du bouton").setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        try {
            if (interaction.channel.type == ChannelType.GuildStageVoice)return;
            interaction.channel.messages.fetch({limit: 1, cache: true})
                .then(message => {
                    if (message.first()?.editable) {
                        message.first().edit({
                            components: [
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
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
                        // @ts-ignore
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