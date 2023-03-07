import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ActivityType} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Vous permet de gérer la configuration du bot.")
        .addSubcommand(
            opt => opt.setName("bot-name").setDescription("Permet de changer le pseudo du bot")
                .addStringOption(
                    opt => opt.setName("new-name").setDescription("Le nouveau nom que vous voulez pour le bot.").setRequired(true)
                )
        )
        .addSubcommand(
            opt => opt.setName("bot-avatar").setDescription("Permet de changer l'avatar du bot")
                .addAttachmentOption(
                    opt => opt.setName("new-avatar").setDescription("Le nouveau avatar que vous voulez pour le bot.").setRequired(true)
                )
        )
        .addSubcommand(
            opt => opt.setName("status").setDescription("Vous permet de modifier le status du bot")
                .addIntegerOption(
                    opt => opt.setName('activité').setDescription("Définissez l'activité").setRequired(true).addChoices(
                        {name: "Joue à", value: ActivityType.Playing},
                        {name: "Ecoute", value: ActivityType.Listening},
                        {name: "Regarde", value: ActivityType.Watching},
                    )
                )
                .addStringOption(
                    opt => opt.setName('status').setDescription("Définissez le status du bot").setRequired(true).addChoices(
                        {name: "En ligne", value: `online`},
                        {name: "Afk", value: `idle`},
                        {name: "Ne pas déranger", value: `dnd`},
                    )
                )
                .addStringOption(
                    opt => opt.setName("nom").setDescription("Définissez le nom du status (ce qu'il y a après le 'Joue à')").setRequired(true)
                )
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        this[interaction.options.getSubcommand()](interaction, client);
    },
    status(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const activite = interaction.options.getInteger("activité");
        const status = interaction.options.getString("status");
        const name = interaction.options.getString("nom");
        if (status != 'idle' && status != 'dnd' && status != 'online')return;

        client.user.setPresence({
            activities: [{
                type: activite,
                name: name,
            }],
            status: status,
        });

        client.config.discord.presence = {
            name: name,
            status: status,
            type: activite,
        };

        client._fs.writeFileSync(__dirname+"/../../../config.json", JSON.stringify(client.config, null, 2))

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle("Modification du status du bot")
                    .setDescription(`Status: \`${status}\`\nActivité: \`${activite == 3 ? "Regarde" : activite == 2 ? "Ecoute" : "joue à"} ${name}\``)
            ]
        })
    },
    "bot-name"(interaction: ChatInputCommandInteraction, client: EagleClient) {
        client.user.setUsername(interaction.options.getString("new-name"))
            .then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Vous avez changer le pseudo du bot avec succès")
                            .setColor("Green")
                            .setDescription(`Nouveau pseudo: \`${interaction.options.getString("new-name")}\``)
                            .setTimestamp()
                    ]
                })
            })
            .catch(err => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Il y a eu une erreur lors du changement de pseudo ")
                            .setColor("Red")
                            .setDescription("Erreur: " +err)
                            .setTimestamp()
                    ],
                    ephemeral: true
                })
            })
    },
    "bot-avatar"(interaction: ChatInputCommandInteraction, client: EagleClient) {
        interaction.deferReply().then(r => {
            client.user.setAvatar(interaction.options.getAttachment("new-avatar").url)
                .then(() => {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous avez changer l'avatar du bot avec succès")
                                .setColor("Green")
                                .setDescription("Nouveau avatar :")
                                .setImage(interaction.options.getAttachment("new-avatar").url)
                                .setTimestamp()
                        ]
                    })
                })
                .catch(err => {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Il y a eu une erreur lors du changement d'avatar ")
                                .setColor("Red")
                                .setDescription("Erreur: " +err)
                                .setTimestamp()
                        ]
                    })
                })
        })
    }
}