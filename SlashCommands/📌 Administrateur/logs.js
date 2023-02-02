const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, CommandInteraction, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription("Permet d'activer ou de désactiver les logs pour votre serveur")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
		
        var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
        });
        let Name = [];
        let value = [];
        let channel = [];
        for (let i = 0; i < 28; i++) {
            Name.push(`${Name.length+1}. ${Object.entries(guildData.logs.enable)[i][0]}`);
            value.push(`${Object.entries(guildData.logs.enable)[i][1] ? "Actif" : "Inactif"}`)
            channel.push(`${Object.entries(guildData.logs.enable)[i][1] == true ? `<#${Object.entries(guildData.logs.channel)[i][1]}>` : "*Aucun channel*"}`)
        }
		interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Gold")
                .setTitle("Configuration des logs du serveurs")
                .setFields(
                    {name: "Nom du log", value: Name.join("\n"), inline: true},
                    {name: "Status", value: value.join("\n"), inline: true},
                    {name: "Channels", value: channel.join("\n"), inline: true},
                )
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]change")
                    .setLabel("Modifier une option")
                    .setStyle(1)
                )
            ]
        }).then(msg => {
            ask(msg, interaction)
        })

        function ask(msg, interaction) {
            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: c => c.customId == "[no-check]change",
                time: 60 * 1000,
            })
            collector.on('collect', inter => {
                inter.showModal(
                    new ModalBuilder()
                    .setTitle("Paramétrage des logs")
                    .setCustomId("[no-check]logs_modal")
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId("1")
                            .setLabel("Quelle options voulez-vous modifier")
                            .setRequired(true)
                            .setPlaceholder("Nombre entre 1 et 28. ex : 1 6 7 8 10 25 ou all")
                            .setStyle(TextInputStyle.Short)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId("2")
                            .setLabel("Quelle est le status pour l'option")
                            .setRequired(true)
                            .setPlaceholder("entrez 'actif' ou 'inactif'")
                            .setStyle(TextInputStyle.Short)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId("3")
                            .setLabel("Si actif entrez l'id du channel")
                            .setPlaceholder("ex : 1031215419752714312")
                            .setRequired(false)
                            .setStyle(TextInputStyle.Short)
                        ),
                    )
                );
                inter.awaitModalSubmit({
                    time: 60 * 1000,
                    filter: mod => mod.customId == "[no-check]logs_modal",
                }).then(mod => {
                    collector.stop()
                    let positions = mod.fields.getTextInputValue("1").split(' ');
                    const status = mod.fields.getTextInputValue("2").toLowerCase();
                    const channelId = mod.fields.getTextInputValue("3");

                    if (positions[0] == "all") positions = [...Array(28).keys()].map(x => ++x)

                    if (status != "actif" && status != "inactif")return mod.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor('Red')
                            .setDescription("**Le status doit être 'actif' ou 'inactif' !**")
                        ],
                        ephemeral: true
                    });

                    if(status == "actif") {
                        if (!client.channels.cache.get(channelId))return mod.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setColor('Red')
                                .setDescription("**Le channel est introuvable !**")
                            ],
                            ephemeral: true
                        });
                    }
                    for (let position of positions) {
                        if (position <= 0 || position > 28 ) {
                            return mod.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription("**Vous devez rentrer un nombre en 1 et 28 !**")
                                ],
                                ephemeral: true
                            });
                        }
                        if(status == "actif") {
                            guildData.logs.enable[Object.entries(guildData.logs.enable)[Number(position)-1][0]] = true;
                            guildData.logs.channel[Object.entries(guildData.logs.channel)[Number(position)-1][0]] = channelId;
                            
                            Name[Number(position)-1] = `${Number(position)}. ${Object.entries(guildData.logs.enable)[Number(position)-1][0]}`;
                            value[Number(position)-1] = `${Object.entries(guildData.logs.enable)[Number(position)-1][1] ? "Actif" : "Inactif"}`;
                            channel[Number(position)-1] = `${Object.entries(guildData.logs.enable)[Number(position)-1][1] == true ? `<#${Object.entries(guildData.logs.channel)[Number(position)-1][1]}>` : "*Aucun channel*"}`;    
                        } else {
                            guildData.logs.enable[Object.entries(guildData.logs.enable)[Number(position)-1][0]] = false;
                            guildData.logs.channel[Object.entries(guildData.logs.channel)[Number(position)-1][0]] = null;
    
    
                            Name[Number(position)-1] = `${Number(position)}. ${Object.entries(guildData.logs.enable)[Number(position)-1][0]}`;
                            value[Number(position)-1] = `${Object.entries(guildData.logs.enable)[Number(position)-1][1] ? "Actif" : "Inactif"}`;
                            channel[Number(position)-1] = `${Object.entries(guildData.logs.enable)[Number(position)-1][1] == true ? `<#${Object.entries(guildData.logs.channel)[Number(position)-1][1]}>` : "*Aucun channel*"}`;    
                        }
                    }
                
                    guildData.save();

                    if (status == "actif") {
                        mod.update({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("Gold")
                                .setTitle("Configuration des logs du serveurs")
                                .setFields(
                                    {name: "Nom du log", value: Name.join("\n"), inline: true},
                                    {name: "Status", value: value.join("\n"), inline: true},
                                    {name: "Channels", value: channel.join("\n"), inline: true},
                                )
                            ],
                        }).then(msg => {
                            ask(msg, interaction)
                        })
                    } else {
                        mod.update({
                            embeds: [
                                new EmbedBuilder()
                                .setColor("Gold")
                                .setTitle("Configuration des logs du serveurs")
                                .setFields(
                                    {name: "Nom du log", value: Name.join("\n"), inline: true},
                                    {name: "Status", value: value.join("\n"), inline: true},
                                    {name: "Channels", value: channel.join("\n"), inline: true},
                                )
                            ],
                        }).then(msg => {
                            ask(msg, interaction)
                        })
                    }
                    
                }).catch((reason) => {
                    if (reason != "time")return;
                    interaction.editReply({
                        components: [
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("[no-check]change")
                                .setLabel("Modifier une option")
                                .setDisabled(true)
                                .setStyle(1)
                            )
                        ]
                    });
                })
            });
            collector.on("end", (coll,reason) => {
                if (reason != "time")return;
                interaction.editReply({
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("[no-check]change")
                            .setLabel("Modifier une option")
                            .setDisabled(true)
                            .setStyle(1)
                        )
                    ]
                })
            })
        }
	},
}