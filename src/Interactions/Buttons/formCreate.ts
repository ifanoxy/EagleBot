import {
    ActionRowBuilder,
    ButtonInteraction,
    EmbedBuilder,
    ModalBuilder,
    TextChannel,
    TextInputBuilder
} from "discord.js";
import {EagleClient} from "../../structures/Client";


export default {
    async execute(interaction: ButtonInteraction, client: EagleClient) {
        var guildData = client.managers.guildsManager.getIfExist(interaction.guildId);
        if (!guildData) return interaction.reply({content: "Il y a un problème avec ce formulaire !"});

        const formData = guildData.form[interaction.customId.split('#')[1]];

        if (!formData) return interaction.reply({content: "Il y a un problème avec ce formulaire !"});

        let formModal = new ModalBuilder()
            .setTitle("Formulaire")
            .setCustomId("[no-check]form_modal");

        let i = 0;
        for (let TextInputData of formData.data) {
            formModal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                        .setStyle(TextInputData.style)
                        .setLabel(TextInputData.question)
                        .setRequired(TextInputData.required)
                        .setMaxLength(TextInputData.max)
                        .setMinLength(TextInputData.min)
                        .setCustomId(`${i}`)
                )
            )
            i++;
        }
        interaction.showModal(formModal);

        interaction.awaitModalSubmit({
            time: 120 * 1000,
            filter: i => i.customId == "[no-check]form_modal",
        })
            .then(modalInter => {
                interaction.guild.channels.fetch(formData.channel)
                    .then(channel => {
                        let formEmbed = new EmbedBuilder()
                            .setTitle(`Formulaire | Réponse de ${interaction.user.tag}`)
                            .setThumbnail(interaction.user.avatarURL())
                            .setDescription(`Lien vers le formulaire: **[cliquez-ici](${interaction.message.url})**`)
                            .setColor("Yellow")
                            .setTimestamp();
                        let i = 0;
                        for (let TextInputData of formData.data) {
                            formEmbed.addFields(
                                {
                                    name: `${TextInputData.question}`,
                                    value: modalInter.fields.getTextInputValue(`${i}`) || "Pas de réponse",
                                }
                            )
                            i++;
                        }
                        (channel as TextChannel).send({
                            embeds: [formEmbed]
                        })
                        modalInter.reply({
                            embeds: [
                                new EmbedBuilder().setColor("Green")
                                    .setDescription("Vous réponse au formulaire à été envoyé avec succès !")
                            ],
                            ephemeral: true
                        })
                    })
                    .catch(() => {
                        delete guildData.form
                        guildData.save()
                    })
            })
    }
}