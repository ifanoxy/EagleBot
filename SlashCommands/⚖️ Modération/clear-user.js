const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder, ChannelType } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear-user")
    .setDescription("Permet de supprimer +100 messages d'un utilisateur")
    .setDMPermission(false)
    .addUserOption(
        opt => opt.setName("utilisateur").setDescription("l'utilisateur dont vous souhaitez supprimer les messages").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     * @returns 
     */
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        const user = interaction.options.getUser("utilisateur")

        let embed = new EmbedBuilder()
        .setColor("DarkGold")
        .setTitle("Supression des messages de " + user.tag)
        .setDescription("Nombre de messages supprimés : \`En cours\`");

        interaction.reply({
            embeds: [embed]
        }).then(() => {
            let nbrSup = 0

            interaction.guild.channels.cache.filter(chn => chn.type == ChannelType.GuildText).map(async channel => {
                let messages = await channel.messages.fetch({ limit: 100});
                let userMessages = messages.filter((m) => m.author.id === user.id);
                return await channel.bulkDelete(userMessages).then(() => {  
                    nbrSup += userMessages.size;
                }).catch(err => {});
            })
    
            setTimeout(() => {
                interaction.editReply({
                    embeds: [embed.setDescription(`Nombre de messages supprimés : \`${nbrSup}\``)]
                })
            }, (2000 + interaction.guild.channels.cache.size * 100))
        })
    }
}