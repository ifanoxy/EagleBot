const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear-webhook")
    .setDescription("permet de supprimer tout les webhooks du serveur")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!client.moderation.checkWhitelist(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être whitelist pour utiliser cette commande !")
            ],
            ephemeral: true
        });

        interaction.guild.fetchWebhooks()
        .then(webhooks => {
            if (webhooks.size == 0)return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Il n'y a aucun webhook sur ce serveur.")
                    .setColor("Red")
                    .setDescription(`Erreur: ` + err)
                ],
                ephemeral: true
            });
            webhooks.map(webhook => {
                webhook.delete(`Demandé par ${interaction.user.tag}`)
            });
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez supprimé tout les webhooks avec succès !")
                    .setColor("Green")
                ]
            });
        })
        .catch(err => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Il y a eu un problème lors de la recherche des webhooks")
                    .setColor("Red")
                    .setDescription(`Erreur: ` + err)
                ],
                ephemeral: true
            });
        });
    }
}