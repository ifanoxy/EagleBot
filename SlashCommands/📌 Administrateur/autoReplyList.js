const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder,  }= require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoreply-liste")
        .setDescription("Permet d'affichier la liste des questions avec leur réponse")
        .setDMPermission(false),
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
        });
        
        if (guildData.autoreply.length == 0) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vous n'avez créer aucun auto reply")
                    .setColor("Red")
                    .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "autoreply-create").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
            ]
        })

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Voici la liste de vos auto reply :")
                    .setColor("#eb2384")
                    .addFields(
                        guildData.autoreply.map(autorep => {
                            return {
                                name: autorep.question,
                                value: autorep.reponse,
                            }
                        })
                    )
            ]
        });
    }
}