const { SlashCommandBuilder, PermissionsBitField, CommandInteraction, EmbedBuilder, Embed } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("permet de ouvrir un salon textuel")
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
            SendMessages: true
        })
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Channel unlock")
                    .setDescription(`Ce channel a été unlock par <@${executor.id}>`)
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
                    .setDescription("je ne peux pas unlock ce channel")
                ],
                ephemeral: true
            })
        })
    }
}