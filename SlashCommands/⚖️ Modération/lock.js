const { SlashCommandBuilder, PermissionsBitField, CommandInteraction, EmbedBuilder, Embed } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("permet de fermer un salon textuel")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     * @returns 
     */
    execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: false
        })
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setTitle("Channel lock")
                    .setDescription(`Ce channel a été lock par <@${executor.id}>`)
                    .setTimestamp()
                ]
            })
        })
        .catch((err) => {
            console.log(err)
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription("je ne peux pas lock ce channel")
                ],
                ephemeral: true
            })
        })
    }
}