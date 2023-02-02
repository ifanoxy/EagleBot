const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("avertir un utilisateur du discord")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("utilisateur").setDescription("définissez l'utilisateur que vous souhaitez avertir").setRequired(true)
    )
    .addStringOption(
        option => option.setName("raison").setDescription("Permet de définir la raison de l'avertissement de la personne.").setRequired(false)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const cible = interaction.options.getMember("utilisateur")
        if (Number(cible.permissions) > Number(executor.permissions)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas avertir cette personne !")
            ],
            ephemeral: true
        });
        const guildData = await client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId
        });

        const cibledata = await client.managers.membersManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
            memberId: executor.id,
        })
        cibledata.moderation.warn++;

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("DarkOrange")
                .setDescription(`<@${cible.id}> vient de prendre un avertissement de la part de <@${executor.id}>`)
                .setTimestamp()
            ]
        });

        for (const palier of guildData.warn) {
            if (palier.nombre <= cibledata.moderation.warn) {
                switch (palier.sanction) {
                    case "mute" : {
                        client.moderation.muteUser({
                            userId: cible.id, 
                            guildId: interaction.guildId,
                            executor: "par le bot" ,
                            raison: `${cibledata.moderation.warn} avertissements`,
                        });
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("DarkOrange")
                                .setDescription(`<@${cible.id}> vient d'être mute car il a trop d'avertissements !`)
                                .setTimestamp()
                            ]
                        });
                    }break;
                    case "kick" : {
                        cible.kick(`${cibledata.moderation.warn} avertissements`).catch(()=>{});
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("DarkOrange")
                                .setDescription(`<@${cible.id}> vient d'être kick car il a trop d'avertissements !`)
                                .setTimestamp()
                            ]
                        });
                    }break;
                    case "ban" : {
                        cible.ban(`${cibledata.moderation.warn} avertissements`).catch(()=>{});
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("DarkOrange")
                                .setDescription(`<@${cible.id}> vient d'être banni car il a trop d'avertissements !`)
                                .setTimestamp()
                            ]
                        });
                    }break;
                }
                break
            }
        }

        const memberData = await client.managers.membersManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
            memberId: executor.id,
        })
        if (guildData.logs.enable.warn) {
            const channel = guildData.logs.channel.warn;
            if (channel != null && channel != undefined) {
                client.channels.cache.get(channel).send({
                    embeds: [
                        new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | Warn`)
                        .setDescription(
                            `**Warn donné à :** <@${cible.id}> (${cible.id})\n\n`+
                            `**Warn par:** <@${executor.id}>`
                        )
                    ]
                });
            }
        }
        memberData.moderation.warn++;
        memberData.save();
        cibledata.save();
    }
}