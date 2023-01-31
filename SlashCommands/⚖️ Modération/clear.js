const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Permet de supprimer un nombre de message dans un channel")
    .addIntegerOption(
        option => option.setName("nombre-messages").setDescription("Insérer le nombre de message à supprimer").setMaxValue(150).setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        interaction.channel.bulkDelete(interaction.options.getInteger("nombre-messages"))
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Greyple")
                    .setDescription(`Vous venez de supprimer **${interaction.options.getInteger("nombre-messages")}** messages`)
                    .setTimestamp()
                    .setFooter({text: "Auto-suppression dans 5s"})
                ]
            })
            .then(msg => setTimeout(() => msg.delete(), 5*100))
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Avec la limitation de discord je ne peux pas supprimer les message datant de plus de 14 jours`)
                    .setTimestamp()
                ]
            })
        })
    }
}