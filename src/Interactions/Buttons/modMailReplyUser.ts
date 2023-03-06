import {
    ActionRowBuilder,
    ButtonInteraction,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {EagleClient} from "../../structures/Client";
import {DiscordColor} from "../../structures/Enumerations/Embed";

export default {
    async execute(interaction: ButtonInteraction, client: EagleClient) {
        const user = await client.users.fetch(interaction.customId.split("#")[1]);
        if (!user) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Cette utilisateur n'est plus dans un serveur ou je suis, je ne peux donc plus communiquer avec celui-ci.")
                ]
            })
        } else {
            client.func.utils.askWithModal(
                interaction,
                new ModalBuilder()
                    .setTitle(interaction.component.label)
                    .setCustomId("[no-check]modmailReplyUserModal")
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>().addComponents(
                            new TextInputBuilder()
                                .setLabel("Entrer la réponse que vous voulez envoyer")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                                .setCustomId("reponse")
                        )
                    )
            ).then(inter => {
                if (!inter)return;
                const reponse = inter.fields.getTextInputValue("reponse");
                user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(DiscordColor.Eagle)
                            .setTitle("ModMail")
                            .setDescription(`**Vous avez reçus une réponse de <@${inter.user.id}> :**\n\n${reponse}`)
                            .setTimestamp()
                    ]
                });
                inter.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Réponse envoyé par ${inter.user.username}`)
                            .setDescription(reponse)
                            .setColor(DiscordColor.White)
                            .setTimestamp()
                    ]
                })
            })
        }
    }
}