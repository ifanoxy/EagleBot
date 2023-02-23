import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unban-all")
        .setDescription("Permet de débannir tout les membres du serveur")
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const bans = await interaction.guild.bans.fetch();
        if (bans.size == 0)return interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription("Il y a personne de banni sur ce serveur !").setColor("Red")
            ],
            ephemeral: true
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(`Débannissement de \`${bans.size}\` utilisateurs en cours...`).setColor("Purple")
            ]
        }).then(() => {
            bans.map(ban => interaction.guild.bans.remove(ban.user.id, `Demandé par ${interaction.user.tag} (${interaction.user.id}) | Unban All`).catch());
            interaction.editReply({
                embeds: [
                    new EmbedBuilder().setDescription(`Débannissement de \`${bans.size}\` utilisateurs effectués !`).setColor("Blurple")
                ]
            })
        })
    }
}