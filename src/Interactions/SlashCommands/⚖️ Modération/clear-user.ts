import {BaseGuildTextChannel, ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("clear-user")
        .setDescription("Supprimer les 100 derniers messages d'un utilisateur dans chaque channel")
        .setDMPermission(false)
        .addUserOption(
            opt => opt.setName("utilisateur").setDescription("L'utilisateur dont vous souhaitez supprimer les messages").setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const user = interaction.options.getUser('utilisateur');
        let embed = new EmbedBuilder()
            .setColor("DarkGold")
            .setTitle("Supression des messages de " + user.tag)
            .setDescription("Nombre de messages supprimés : \`En cours\`");

        interaction.reply({
            embeds: [embed]
        }).then(() => {
            let nbrSup = 0

            Promise.all(
                // @ts-ignore
                interaction.guild.channels.cache.filter(chn => chn.type == ChannelType.GuildText).map(async (channel: BaseGuildTextChannel) => {
                    let messages = await channel.messages.fetch({ limit: 100});
                    let userMessages = messages.filter((m) => m.author.id === user.id);
                    return await channel.bulkDelete(userMessages).then(() => {
                        nbrSup += userMessages.size;
                    }).catch(err => {});
                })
            ).then(() => {
                if (user.id != client.user.id) {
                    interaction.editReply({
                        embeds: [embed.setDescription(`Nombre de messages supprimés : \`${nbrSup}\``)]
                    });
                } else {
                    if (interaction.channel.type != ChannelType.GuildStageVoice) {
                        interaction.channel.send({
                            embeds: [embed.setDescription(`Nombre de messages supprimés : \`${nbrSup}\``)]
                        });
                    }
                }
                let executorData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, { memberId: interaction.user.id });
                executorData.moderation.removedMessage += nbrSup;
                executorData.save();
            })
        })
    }
}