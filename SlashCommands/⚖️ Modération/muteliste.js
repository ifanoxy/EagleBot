const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { EagleClient } = require("../../structures/Client");
const mute = require("./mute");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute-list')
    .setDescription('Permet de voir la liste des personnes mutes')
    .setDMPermission(false),
    /**
     * 
     * @param {*} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        let muteArray = []
        const muteData = client.managers.mutesManager.map(p => p).filter(f => f.guildId == interaction.guildId)
        for (let mute of muteData) {
            muteArray.push({
                memberId: mute.memberId,
                raison: mute.reason
            })
        }
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Fuchsia')
                .setTitle("Listes des personnes mutes sur ce serveur")
                .setDescription(`${muteArray.length != 0 ? muteArray.map(p => `\n<@${p.memberId}> - **raison:** ${p.raison}`) : "Il y a aucun mute sur ce serveur"}`)
                .setTimestamp()
            ],
            ephemeral: true
        });
    }
}