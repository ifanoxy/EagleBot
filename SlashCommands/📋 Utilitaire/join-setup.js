const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("gérer le message lorsque les membres rejoignent")
    .setDMPermission(false)
    .addSubcommand(
        sub => sub.setName("activer").setDescription("Permet d'activer les messages de bienvenue")
        .addChannelOption(
            opt => opt.setName("channel").setDescription("le channel où seront envoyé les messages de bienvenue").setRequired(true).addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(
            opt => opt.setName("message").setDescription("le message qui sera envoyé")
        )
        .addStringOption(
            opt => opt.setName("embed").setDescription("L'embed qui sera envoyé").setAutocomplete(true)
        )
    )
    .addSubcommand(
        sub => sub.setName("désactiver").setDescription("Permet désactiver les messages de bienvenue")
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
        let database = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId
        })
        if (interaction.options.getSubcommand() ==  "activer") {
            const channel = interaction.options.getChannel("channel");
            const message = interaction.options.getString("message");
            const embedName = interaction.options.getString("embed");

            if (!message && !embedName)return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Vous devez définir au moins un message ou un embed de bienvenue")
                ],
                ephemeral: true
            });

            if (embedName) database.join.message.embed = client.managers.membersManager.getIfExist(interaction.user.id)[embedName];
            if (message) database.join.message.content = message;

            database.join.channelId = channel.id;

            database.save();

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez activé les messages automatiques lors de l'arrivé d'un membre avec succès !")
                    .setColor("Green")
                ]
            })
        } else {
            database.join = null;
            database.save();

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Vous avez enlever les messages automatiques lors de l'arrivé d'un membre")
                ]
            })
        }
    }
}