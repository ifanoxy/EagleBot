const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("guild-leave")
    .setDescription("permet de faire quitter le bot d'un serveur.")
    .addStringOption(
        opt => opt.setName("guild-id").setDescription("Veuillez insérer l'indenfiant du serveur").setRequired(true)
    ),
    execute(interaction, client) {
        if (!client.moderation.checkOwner(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être owner pour utiliser cette commande !")
            ],
            ephemeral: true
        });

        const id = interaction.options.getString("guild-id");
        const guild = client.guilds.cache.get(id);

        if(!guild)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("le serveur est introuvable !")
            ],
            ephemeral: true
        });
        guild.leave()
        .then(() => {
            try{
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription("Vous venez de quitter le serveur avec succès !")
                    ]
                });
            }catch{
                client.error(err)
            }
        })
        .catch((err) => {
            if (err.name == "Error [GuildOwned]") {
                guild.delete()
                .then(() => {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription("Vous venez de quitter le serveur avec succès !")
                        ]
                    });
                }).catch(err => client.error(err))
            }
        })
    }
}