const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, CommandInteraction, PermissionsBitField, PermissionOverwrites, ChannelFlagsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket-use")
    .setDescription("Permet d'utiliser un template de ticket")
    .setDMPermission(false)
    .addStringOption(
        option => option.setName("template").setDescription("Quel template souhaitez vous utiliser").setAutocomplete(true).setRequired(true)
    )
    .addChannelOption(
        option => option.setName("catégorie").setDescription("La catégorie où seront créer les tickets").addChannelTypes(ChannelType.GuildCategory)
    ),
    async autocomplete(interaction, client) {
        const userData = client.managers.ticketsManager.getIfExist(interaction.user.id, {
            userId: interaction.user.id,
        });
        const focusedValue = interaction.options.getFocused();
		let choices = [];
        if (!userData) {
            choices.push("Vous n'avez pas de template -> /ticket-setup")
        } else {
            choices = Object.keys(userData.data)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		); 
    },
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const userData = client.managers.ticketsManager.getIfExist(interaction.user.id, {
            userId: interaction.user.id,
        });
        if (!userData)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("DarkPurple")
                .setTitle("Vous n'avez pas de template de ticket")
                .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "ticket-setup").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
            ],
            ephemeral: true
        })

        const ticketsData = userData.data[interaction.options.getString("template")];

        let categorie = interaction.options.getChannel("catégorie")
        if (!categorie) {
            await interaction.guild.channels.create({
                type: ChannelType.GuildCategory,
                name: "Ticket",
                topic: "Catégorie créer automatiquement pour les tickets",
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: "ViewChannel"
                    }
                ]
            }).then(cate => {
                categorie = cate
            })
        }

        let rowTicket = new ActionRowBuilder()
        let selectMenuTicket = new StringSelectMenuBuilder()
            .setCustomId(`ticketCreate#${categorie.id}`)
            .setMaxValues(1)
            .setPlaceholder(ticketsData[0].placeHolder || "aucun")

        let i = 0;
        for (let ticket of ticketsData) {
            if (ticket.color) {
                rowTicket.addComponents(
                    new ButtonBuilder()
                    .setCustomId(`ticketCreate#${categorie.id}#${i}`)
                    .setStyle(ticket.color)
                    .setLabel(ticket.name)
                )
            } else {
                selectMenuTicket.addOptions({
                    label: `${ticket.name}`,
                    description: `${ticket.description}`,
                    value: `${ticket.name}`,
                })
            }
            i++;
        }

        if (ticketsData[0].placeHolder) {
            rowTicket.addComponents(selectMenuTicket)
        }

        interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: "Ouvrez votre ticket !", iconURL: interaction.client.user.avatarURL()})
                .setDescription("Afin de créer un ticket, vous devez cliquer sur un des boutons/menu sélectif.\n\nLes différentes options possibles sont :")
                .addFields(
                    ticketsData.map(data => {return{
                        name: data.name,
                        value: data.description,
                    }})
                )
                .setColor("Gold")
                .setFooter({text: "Ticket"})
            ],
            components: [
                rowTicket
            ]
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Le message de ticket à été envoyé avec succès !")
                .setColor("Blurple")
            ],
            ephemeral: true
        })
    }
}