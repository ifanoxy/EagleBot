const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed-create")
    .setDescription("Vous permet de créer un embed")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Créateur d'embed")
                .setDescription(`
                **Vous avez 2 possibilités de création d'embed :**
                1. Rapide (environ 2 minutes de création)
                2. Avancé (environ 5 minutes de création)

                Vous pourrez ensuite envoyer cette embed et/ou le sauvegarder
                pour le réutiliser pour tard !
                `)
                .setColor("Blue")
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]embed_short")
                    .setLabel("Rapide")
                    .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                    .setCustomId("[no-check]embed_advanced")
                    .setLabel("Avancé")
                    .setStyle(ButtonStyle.Success)
                )
            ],
            ephemeral: true
        })
        .then(client.fonctions.askWithButton(msg)
            .then(inter => {
                const type = inter.customId.split("_")[1];

                if (type == "short")
                inter.update({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Créateur d'embed | Rapide")
                        .setDescription("Définissez les éléments principaux d'un embed: \n\nCouleur \nTitre\nDescription\nFooter")
                        .setColor("DarkAqua")
                    ],
                    ephemeral: true
                })
                .then(msg => client.fonctions.askWithButton(msg)
                    .then(inter => client.fonctions.askWithModal(
                            inter,
                            new ModalBuilder()
                            .setCustomId("[no-check]embed_fast")
                            .setTitle("Créateur d'Embed | Rapide")
                            .setComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder().setCustomId("title").setLabel("Titre de votre embed").setRequired(false).setStyle(1).setMaxLength(256)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder().setCustomId("description").setLabel("Description de votre embed").setRequired(true).setStyle(2).setMaxLength(3500).setPlaceholder("/p --> retour à la ligne")
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder().setCustomId("color").setLabel("Couleur de votre embed (hexadécimal ex: #9283ab)").setRequired(false).setStyle(1).setMaxLength(7)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder().setCustomId("footer").setLabel("Footer de votre embed").setRequired(false).setStyle(1).setMaxLength(256)
                                ),
                            )
                        )
                        .then(inter2 => {
                            const titre = inter2.fields.getTextInputValue('title');
                            const description = inter2.fields.getTextInputValue('description');
                            const color = inter2.fields.getTextInputValue('color');
                            const footer = inter2.fields.getTextInputValue('footer');

                            inter2.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Vous avez terminé la création de votre embed !")
                                ]
                            })
                        })
                    )
                );
            })
        )
    }
}