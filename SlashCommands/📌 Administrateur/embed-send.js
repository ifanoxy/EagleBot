const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed-send")
    .setDescription("Vous permet d'envoyer un embed")
    .setDMPermission(false)
    .addStringOption(
        opt => opt.setName("embed").setDescription("L'embed que vous souhaitez envoyer").setRequired(true).setAutocomplete(true)
    ),
    async autocomplete(interaction, client) {
        const userData = client.managers.membersManager.getIfExist(interaction.user.id, {
            memberId: interaction.user.id,
        });
        const focusedValue = interaction.options.getFocused();
		let choices = [];
        if (!userData || Object.keys(userData.embeds).length == 0) {
            choices.push("Vous n'avez pas créer d'embed --> /embed-create")
        } else {
            choices = Object.keys(userData.embeds)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		); 
    },
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        
        const userData = client.managers.membersManager.getIfExist(interaction.user.id, {
            userId: interaction.user.id,
        });
        if (!userData || Object.keys(userData.embeds).length == 0)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("DarkPurple")
                .setTitle("Vous n'avez pas d'embed créé")
                .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed-create").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
            ],
            ephemeral: true
        });

        const embedData = userData.embeds[interaction.options.getString('embed')];
        
        interaction.channel.send({
            embeds: [
                embedData
            ]
        }).then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setTitle("L'embed a été envoyé avec succès !").setColor("Blurple")
                ],
                ephemeral: true
            })
        })
    }
}