const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("rendre la parole un utilisateur du discord")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez unmute").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const cible = interaction.options.getUser("utilisateur")
        let muteData = client.managers.mutesManager.getIfExist(`${interaction.guildId}-${cible.id}`);
        if (muteData == null) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`L'utilisateur n'est pas mute !`)
                .setTimestamp()
            ],
            ephemeral: true
        });
        const guildData = client.managers.guildsManager.getIfExist(interaction.guildId)
        const reponsekick = client.guilds.cache.get(interaction.guildId).members.cache.get(cible.id).roles.remove(guildData.mute)
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`${cible} a été unmute par <@${executor.id}>`)
                    .setTimestamp()
                ]
            });
            return 1
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("Il y a eu un problème lors de la suppression du rôle !")
                ],
                ephemeral: true
            });
            return 0
        })
        if (!reponsekick)return

        muteData.delete();
    }
}