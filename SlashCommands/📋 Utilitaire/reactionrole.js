const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reaction-role")
    .setDescription("Vous permet de gérer les réactions role pour votre serveur")
    .setDMPermission(false)
    .addSubcommand(
        sub => sub
        .setName("bouton")
        .setDescription("vous permet de créer un reaction role avec des boutons")
        .addIntegerOption(
            opt => opt.setName("nombre-boutons").setDescription("le nombre de boutons").setRequired(true).setMaxValue(25).setMinValue(1)
        )
        .addStringOption(
            opt => opt.setName("type").setDescription("le type de reaction role").addChoices(
                {name: "Normal", value: 'normal'},
                {name: "Ajoute Seulement", value: 'onlyAdd'},
                {name: "Retire Seulement", value: 'onlyRemove'},
            )
        )
    )
    .addSubcommand(
        sub => sub
        .setName("select-menu")
        .setDescription("vous permet de créer un reaction role avec un select menu")
        .addIntegerOption(
            opt => opt.setName("nombre-options").setDescription("le nombre d'options dans le selectMenu").setRequired(true).setMaxValue(15).setMinValue(1)
        )
        .addStringOption(
            opt => opt.setName("type").setDescription("le type de reaction role").addChoices(
                {name: "Normal", value: 'normal'},
                {name: "Ajoute Seulement", value: 'onlyAdd'},
                {name: "Retire Seulement", value: 'onlyRemove'},
            )
        )
    )
    .addSubcommand(
        sub => sub
        .setName("emoji")
        .setDescription("vous permet de créer un reaction role avec des émojis")
        .addStringOption(
            opt => opt.setName("type").setDescription("le type de reaction role").addChoices(
                {name: "Normal", value: 'normal'},
                {name: "Ajoute Seulement", value: 'onlyAdd'},
                {name: "Retire Seulement", value: 'onlyRemove'},
            )
        )
    ),
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const type = interaction.options.getString('type');
        sendAskEmbed(client, interaction)
        .then(modalInteraction => {
            const ReactionRoleEmbed = new EmbedBuilder()
            .setTitle(modalInteraction.fields.getTextInputValue("title"))
            .setColor(modalInteraction.fields.getTextInputValue("color") || 'Random')
            .setFooter({text: modalInteraction.fields.getTextInputValue("footer") || null});

            switch (interaction.options.getSubcommand()) {
                case "type" : {
                    const nbr = interaction.options.getInteger("nombre-boutons");
                    
                }break;
                case "select-menu" : {
                    const nbr = interaction.options.getInteger("nombre-options");
    
                }break;
                case "emoji" : {
    
                }break;
            };
        });
        
        /**
         * 
         * @param {EagleClient} client
         * @param {CommandInteraction} interaction 
         * @param {Number} nbr 
         */
        function sendAskEmbed(client, interaction) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("DarkGold")
                    .setTitle("Création de l'embed de réaction rôle")
                    .setDescription("Définissez la couleur, le titre et le footer de l'embed du reaction role")
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("Ouvrir le modal")
                        .setCustomId("[no-check]rr_openModal")
                    )
                ]
            }).then(msg => {
                return client.fonctions.askWithButton(msg, null, interaction, 120)
                .then(interactionButton => {
                    if (!interactionButton)return null;
                    return client.fonctions.askWithModal(
                        interactionButton,
                        new ModalBuilder().addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                .setCustomId("title")
                                .setLabel("Le Titre de votre embed")
                                .setStyle(1)
                                .setRequired(true)
                                .setMaxLength(256)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                .setCustomId("color")
                                .setLabel("La Couleur (hexadecimal) de votre embed")
                                .setStyle(1)
                                .setRequired(false)
                                .setMaxLength(7)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                .setCustomId("footer")
                                .setLabel("Le footer de votre embed")
                                .setStyle(1)
                                .setRequired(false)
                            ),
                        )
                    )
                    .then(interactionModal => {
                        return interactionModal
                    });
                });
            });
        }
    },
}