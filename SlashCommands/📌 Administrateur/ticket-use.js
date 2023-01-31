const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");

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
    execute(interaction, client) {
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

        let rowTicket = new ActionRowBuilder()
        if(ticketsData[0].placeholder) {
            var selectMenuTicket = new StringSelectMenuBuilder()
            .setCustomId(`Ticket#${categorie.id}`)
            .setMaxValues(1)
            .setPlaceholder(ticketsData[0].placeholder)
        }

        let i = 0;
        for (let ticket of ticketsData) {
            if (ticket.color) {
                rowTicket.addComponents(
                    new ButtonBuilder()
                    .setCustomId(`Ticket#${categorie.id}_${i}`)
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

        interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Ouvrez votre ticket !")
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
        })
    }
}