const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("wl-list")
    .setDescription("Permet de voir la liste des identifiants whitelist"),
    /**
     * 
     * @param {} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!client.moderation.checkWhitelist(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être whitelist pour utiliser cette commande !")
            ],
            ephemeral: true
        });
        
        const whitelistData = client.managers.whitelistsManager
    
        let data = []

        for (const whitelisted of whitelistData) {
            data.push(
                {
                    size: data.length,
                    userId: whitelisted[1].values.userId,
                    authorId: whitelisted[1].values.authorId,
                    raison: whitelisted[1].values.reason,
                }
            )
        }

        if(!data.length)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("Il n'y a personne de whitelist")
            ],
        });
        let Embed = new EmbedBuilder().setColor("White").setTitle(`Liste des ${data.length} personnes whitelist`)
        let Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("[no-check]Previous")
            .setDisabled(true)
            .setEmoji("◀️")
            .setStyle(1),
            new ButtonBuilder()
            .setCustomId("[no-check]")
            .setDisabled(true)
            .setLabel(`1/${Math.ceil(data.length/25)}`)
            .setStyle(1),
            new ButtonBuilder()
            .setCustomId("[no-check]Next")
            .setDisabled(false)
            .setEmoji("▶️")
            .setStyle(1),
        )
        
        for (const whitelist of data) {
            if (whitelist.size > 24)break;
            Embed.addFields(
                {name: `‎`, value: `${whitelist.size+1}. <@${whitelist.userId}> par <@${whitelist.authorId}>\n**raison**: ${whitelist.raison}`, inline: true}
            )
        }

        if (data.length <= 24) {
            interaction.reply({
                embeds: [
                    Embed
                ]
            })
        } else {
            interaction.reply({
                embeds: [
                    Embed
                ],
                components: [
                    Row
                ]
            }).then(msg => {
                messageEdit(msg, interaction)
            })

            function messageEdit(msg, interaction) {
                const collector = msg.createMessageComponentCollector({
                    time: 15*1000,
                    componentType: ComponentType.Button,
                    max: 1
                })
                collector.on('collect', inter => { 
                    const reponse = inter.customId.replace("[no-check]","")
                    const position = inter.message.components[0].components[1].label.split("/")
                    Embed.setFields()
                    switch (reponse) {
                        case "Previous" : {
                            let i = (Number(position[0])-1)*25-1
                            let j = (Number(position[0])-1)*25-25
                            while (j <= i && j < data.length) {
                                Embed.addFields(
                                    {name: `‎`, value: `${data[j].size+1}. <@${data[j].userId}> par <@${data[j].authorId}>\n**raison**: ${data[j].raison}`, inline: true}
                                )
                                j++;
                            }
                            if (Number(position[0])-1 == 1) {
                                Row.components[0].setDisabled(true)
                            }
                            Row.components[2].setDisabled(false)
                            Row.components[1].setLabel(`${Number(position[0])-1}/${position[1]}`)
                            inter.update({
                                embeds: [
                                    Embed
                                ],
                                components: [
                                    Row
                                ]
                            }).then(msg => {
                                messageEdit(msg, interaction)
                            })
                        }break;
                        case "Next" : {
                            let i = Number(position[0])*25+24
                            let j = Number(position[0])*25
                            while (j <= i && j < data.length) {
                                Embed.addFields(
                                    {name: `‎`, value: `${data[j].size+1}. <@${data[j].userId}> par <@${data[j].authorId}>\n**raison**: ${data[j].raison}`, inline: true}
                                )
                                j++;
                            }
                            if (Number(position[0])+1 == position[1]) {
                                Row.components[2].setDisabled(true)
                            }
                            Row.components[0].setDisabled(false)
                            Row.components[1].setLabel(`${Number(position[0])+1}/${position[1]}`)
                            inter.update({
                                embeds: [
                                    Embed
                                ],
                                components: [
                                    Row
                                ]
                            }).then(msg => {
                                messageEdit(msg, interaction)
                            })
                        }break;
                    }
                });
                collector.on("end", (coll,reason) => {
                    if (reason != "time")return
                    Row.components[0].setDisabled(true)
                    Row.components[2].setDisabled(true)
                    interaction.editReply({
                        components: [
                            Row
                        ]
                    })
                })
            }
        }
    }
}