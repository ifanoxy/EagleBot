const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket-list")
    .setDescription("Permet de voir la liste de tout vos 'template' de ticket")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        const userData = client.managers.ticketsManager.getIfExist(interaction.user.id);

        let Embed = new EmbedBuilder().setColor("Green").setTitle(`Liste de vos ${Object.keys(userData.data).length} templates de ticket`);
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
            .setLabel(`1/${Math.ceil(Object.keys(userData.data).length/25)}`)
            .setStyle(1),
            new ButtonBuilder()
            .setCustomId("[no-check]Next")
            .setDisabled(false)
            .setEmoji("▶️")
            .setStyle(1),
        );

        for (const data of Object.keys(userData.data)) {
            let i = Embed?.data.fields?.length || 0;
            let k = 0;
            Embed.addFields(
                {
                    name: `ID: ${data}`,
                    value: `**Type:** ${userData.data[data][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[data].map(ticket => {k++; return `${k}. ${ticket.name}`}).join("\n")}`,
                    inline: true
                }
            )
            if (i > 24)break;
        }

        if (Object.keys(userData.data).length <= 24) {
            interaction.reply({
                embeds: [
                    Embed
                ],
                ephemeral: true
            })
        } else {
            interaction.reply({
                embeds: [
                    Embed
                ],
                components: [
                    Row
                ],
                ephemeral: true
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
                            while (j <= i && j < Object.keys(userData.data).length) {
                                let k = 0;
                                Embed.addFields(
                                    {
                                        name: `ID: ${Object.keys(userData.data)[j]}`,
                                        value: `**Type:** ${userData.data[Object.keys(userData.data)[j]][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[Object.keys(userData.data)[j]].map(ticket => {k++; return `${k}. ${ticket.name}`}).join("\n")}`,
                                        inline: true
                                    }
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
                            while (j <= i && j < Object.keys(userData.data).length) {
                                let k = 0;
                                Embed.addFields(
                                    {
                                        name: `ID: ${Object.keys(userData.data)[j]}`,
                                        value: `**Type:** ${userData.data[Object.keys(userData.data)[j]][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[Object.keys(userData.data)[j]].map(ticket => {k++; return `${k}. ${ticket.name}`}).join("\n")}`,
                                        inline: true
                                    }
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