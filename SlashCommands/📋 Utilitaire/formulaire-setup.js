const { SlashCommandBuilder, ActionRowBuilder, ComponentType, ButtonBuilder, EmbedBuilder, ModalBuilder, ButtonInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("formulaire-setup")
    .setDescription("Vous permet de créer des formulaires avec un modal")
    .setDMPermission(false),
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });


        

        /**
         * 
         * @param {Array<EmbedBuilder>} embed 
         * @param {Array<ActionRowBuilder<ButtonBuilder>>} components 
         * @param {ButtonInteraction} interaction 
         * @param {ModalBuilder} modal 
         * @param {Number} time 
         * @returns 
         */
        function askWithButtonToModal(embed, components, interaction, modal, time = 30) {
            return interaction.update({
                embeds: embed,
                components: components,
            })
            .then(msg => {
                return msg.awaitMessageComponent({
                    componentType: ComponentType.Button,
                    time: time * 1000,
                    filter: i => i.customId.startsWith("[no-check]")
                })
                .then(inter => {
                    inter.showModal(modal)
                    inter
                }
                ).catch(reason => {
                    components.map(row => row.components.map(component => component.setDisabled(true)))
                    interaction.editReply({
                        components: components
                    });
                })
            })
            .catch(err => client.error(err))
        } 
    }
}