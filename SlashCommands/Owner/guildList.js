const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("guild-list")
    .setDescription("Permet de voir la liste des serveurs du bot."),
    /**
     * 
     * @param interaction 
     * @param {EagleClient} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!client.moderation.checkOwner(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être owner pour utiliser cette commande !")
            ],
            ephemeral: true
        });

        let guildsData = [];
        
        client.guilds.cache.map(guild => {
            guildsData.push({
                name: guild.name,
                id: guild.id,
                memberCount: guild.memberCount,
                ownerId: guild.ownerId,
                createdAt: guild.createdTimestamp,
            })
        });

        let Embed = new EmbedBuilder().setColor("Fuchsia").setTitle(`Liste des ${guildsData.length} serveurs du bot`);
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
            .setLabel(`1/${Math.ceil(guildsData.length/25)}`)
            .setStyle(1),
            new ButtonBuilder()
            .setCustomId("[no-check]Next")
            .setDisabled(false)
            .setEmoji("▶️")
            .setStyle(1),
        );

        for (const guild of guildsData) {
            let i = Embed?.data.fields?.length || 0;
            Embed.addFields(
                {name: `${i+1}. ${guild.name}`, value: `ID: ${guild.id}\nNombre de membres : ${guild.memberCount}\nOwnerID : ${guild.ownerId}\nCréation <t:${Math.round(guild.createdAt/1000)}:R>`, inline: true}
            )
            if (i > 24)break;
        }

        if (guildsData.length <= 24) {
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
                            while (j <= i && j < guildsData.length) {
                                Embed.addFields(
                                    {name: `${j+1}. ${guild[j].name}`, value: `ID: ${guild[j].id}\nNombre de membres : ${guild[j].memberCount}\nOwnerID : ${guild[j].ownerId}\nCréé <t:${Math.round(guild.createdAt/1000)}:R>`, inline: true}
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
                            while (j <= i && j < guildsData.length) {
                                Embed.addFields(
                                    {name: `${j+1}. ${guild[j].name}`, value: `**ID:** ${guild[j].id}\n**Nombre de membres:** ${guild[j].memberCount}\n**OwnerID:** ${guild[j].ownerId}\nCréé <t:${Math.round(guild.createdAt/1000)}:R>`, inline: true}
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