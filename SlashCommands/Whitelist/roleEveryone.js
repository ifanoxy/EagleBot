const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("role-everyone")
    .setDescription("Permet d'ajouter un rôle à tout les membres")
    .setDMPermission(false)
    .addRoleOption(
        option => option.setName("role").setDescription('définissez le rôle qui sera attribué à tout le monde').setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     * @returns 
     */
    execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        if (!client.moderation.checkWhitelist(executor.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être whitelist pour utiliser cette commande !")
            ],
            ephemeral: true
        });
        const role = interaction.options.getRole("role")
        if (executor.roles.highest.position <= role.position)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'ajouter ce rôle !")
            ],
            ephemeral: true
        });
        const members = interaction.guild.members.cache
        nbr = 0;
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Aqua")
                .setTitle(`Ajout du rôle ${role.name} à tout le monde`)
                .setDescription(`rôle donné à \`${nbr}\` personne`)
                .setTimestamp()
                .setFooter({text: "cette action peut prendre plusieurs minutes"})
            ]
        })
        .then(i => {
            members.map(m => {
                m.roles.add(role.id)
                .then(() => {
                    nbr++;
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Aqua")
                            .setTitle(`Ajout du rôle ${role.name} à tout le monde`)
                            .setDescription(`rôle donné à \`${nbr}\` personnes`)
                            .setTimestamp()
                            .setFooter({text: "cette action peut prendre plusieurs minutes"})
                        ]
                    })
                })
                .catch(() => {})
            })
        })
    }
}