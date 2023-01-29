const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("bl")
    .setDescription("Permet d'ajouter une personne à la blacklist")
    .addStringOption(
        option => option.setName("id").setDescription("entrez l'identifiant de la personne que vous shouaitez blacklist").setRequired(true)
    ).addStringOption(
        option => option.setName("raison").setDescription("entrez la raison pour laquelle vous shouaitez blacklist cette personne").setRequired(false)
    ),
    /**
     * 
     * @param {} interaction 
     * @param {EagleClient} client 
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
        
        const id = interaction.options.getString("id");
        if (!client.checkSnowflake(id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez rentrer un identifiant !")
            ],
            ephemeral: true
        });
        
        if (client.moderation.checkBlacklist(id))return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Cette identifiant est déjà dans la blacklist")
            ],
            ephemeral: true
        });
        const raison = interaction.options.getString("raison");

        client.guilds.cache.map(guild => {
            if (guild.members.cache.has(id)) {
                guild.members.cache.get(id).ban({reason: "Blacklist"}).catch(() => {
                    interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`Je n'ai pas pu bannir cette identifiant dans le serveur ${guild.name}`)
                        ]
                    })
                })
            }
        })
        
        client.managers.blacklistsManager.getAndCreateIfNotExists(id, {
            userId: id,
            reason: raison || "pas de raison",
            authorId: interaction.member.id,
        }).save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Vous avez ajouté l'identifiant \`${id}\` à la blacklist`)
            ]
        });
    }
}