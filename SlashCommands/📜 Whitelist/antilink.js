const { SlashCommandBuilder, EmbedBuilder, CommandInteraction } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("anti-link")
    .setDescription("Permet de bloquer tout les liens")
    .setDMPermission(false)
    .addBooleanOption(
        option => option.setName("activé").setDescription("Permet d'actif ou non l'anti link").setRequired(true)
    )
    .addStringOption(
        option => option.setName("type").setDescription("le type de lien non autorisé").setRequired(true).setChoices(
            {
                name: "discord",
                value: "discord",
            },
            {
                name: "all",
                value: "all",
            }
        )
    )
    .addRoleOption(
        option => option.setName("role-minimum").setDescription("Role minimum nécessaire pour envoyé des liens")
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
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
        
        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId
        });
        guildData.anti.link = {
            roleMini: interaction.options.getRole('role-minimum').id || interaction.guild.roles.everyone,
            active: interaction.options.getBoolean('activé'),
            type: interaction.options.getString('type')
        };
        guildData.save()
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Anti link")
                .setDescription(`
                **status:** ${interaction.options.getBoolean('activé') ? "Activé" : "désactivé"}
                **role minimum:** ${interaction.options.getRole('role-minimum') || interaction.guild.roles.everyone}
                `)
                .setColor("Blue")   
                .setTimestamp()
            ]
        })
    }
}