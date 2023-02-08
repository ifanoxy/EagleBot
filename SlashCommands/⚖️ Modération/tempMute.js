const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder, Collection } = require("discord.js");
const { EagleClient } = require("../../structures/Client");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tempmute")
    .setDescription("mute un utilisateur de votre serveur discord")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez mute").setRequired(true)
    )
    .addStringOption(
        option => option.setName("temps").setDescription("Entrez le temps pour le quel sera mute l'utilisateur").setRequired(true)
    )
    .addStringOption(
        option => option.setName("raison").setDescription("Permet de définir la raison du mute de la personne. (s/m/h/d/w))").setRequired(false)
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
        const cible = interaction.guild.members.cache.get(interaction.options.getUser("utilisateur").id)
        if (Number(cible.permissions) > Number(executor.permissions)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas mute cette personne !")
            ],
            ephemeral: true
        });
        const temps = interaction.options.getString("temps")
        interaction.deferReply().then(() => {
            client.moderation.muteUser({
                userId: cible.id,
                guildId: interaction.guildId,
                executor: executor.user.tag,
                raison: interaction.options.getString('raison') || "pas de raison",
                time: ms(temps)
            })
            .then(() => {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("White")
                        .setDescription(`\`${cible.displayName}\` a été mute par <@${executor.id}> jusqu'au <t:${Math.round((new Date().getTime() + ms(temps))/1000)}>`)
                        .setTimestamp()
                    ]
                });
                client.handlers.fonctionHandler.startFonction([client.handlers.fonctionHandler.FonctionsList.get("checkmute")], client)
                
            })
        })

        const memberData = await client.managers.membersManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
            memberId: executor.id,
        })
        memberData.moderation.mute++;
        memberData.save();
    }
}