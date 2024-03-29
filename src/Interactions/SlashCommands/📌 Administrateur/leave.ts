import {
    AutocompleteInteraction,
    ChannelType,
    ChatInputCommandInteraction, EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Permet de gérer les messages de départ du serveur")
        .setDMPermission(false)
        .addSubcommandGroup(
            subGroup => subGroup
                .setName("setup")
                .setDescription("gérer le message lorsque les membres rejoignent")
                .addSubcommand(
                    sub => sub.setName("activer").setDescription("Permet d'activer les messages de départ")
                        .addChannelOption(
                            opt => opt.setName("channel").setDescription("le channel où seront envoyé les messages de départ").setRequired(true).addChannelTypes(ChannelType.GuildText)
                        )
                        .addStringOption(
                            opt => opt.setName("message").setDescription("le message qui sera envoyé")
                        )
                        .addStringOption(
                            opt => opt.setName("embed").setDescription("L'embed qui sera envoyé").setAutocomplete(true)
                        )
                )
                .addSubcommand(
                    sub => sub.setName("désactiver").setDescription("Permet désactiver les messages de départ")
                )
        )
        .addSubcommand(
            subGroup => subGroup
                .setName("parametre")
                .setDescription("Voir tout les paramètres pour les messages de leave")
        )
        .addSubcommand(
            subGroup => subGroup
                .setName("test")
                .setDescription("Permet de testé le message de leave")
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const userData = client.managers.membersManager.getIfExist(interaction.user.id);
        const focusedValue = interaction.options.getFocused();
        let choices = [];
        if (!userData || Object.keys(userData.embeds).length == 0) {
            choices.push("Vous n'avez pas créer d'embed --> /embed-create")
        } else {
            choices = Object.keys(userData.embeds)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 25);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let database = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId
        });

        const subGroup = interaction.options.getSubcommandGroup() || interaction.options.getSubcommand();
        switch (subGroup) {
            case "setup" : {
                if (interaction.options.getSubcommand() ==  "activer") {
                    const channel = interaction.options.getChannel("channel");
                    const message = interaction.options.getString("message");
                    const embedName = interaction.options.getString("embed");

                    if (!message && !embedName)return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("Vous devez définir au moins un message ou un embed de départ")
                        ],
                        ephemeral: true
                    });

                    if (embedName == "Vous n'avez pas créer d'embed --> /embed-create")return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("DarkPurple")
                                .setTitle("Vous n'avez pas d'embed créé")
                                .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                        ],
                        ephemeral: true
                    });

                    if (embedName) database.leave.message.embed = client.managers.membersManager.getIfExist(interaction.user.id).embeds[embedName];
                    if (message) database.leave.message.content = message;

                    database.leave.channelId = channel.id;

                    database.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous avez activé les messages automatiques lors du départ d'un membre avec succès !")
                                .setColor("Green")
                        ]
                    })
                } else {
                    database.leave = null;
                    database.save();

                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("Vous avez enlever les messages automatiques lors du départ d'un membre")
                        ]
                    })
                }
            }break;
            case "test" : {
                if (!database || !database.leave?.channelId)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription("Il n'y a pas de message de leave créé !")
                    ],
                    ephemeral: true
                });

                if (!interaction.guild.channels.cache.get(database.leave?.channelId)) {
                    database.leave = {channelId: null, message: {content: null, embed: null}};
                    database.save();

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription("Le channel a été supprimé ou est introuvable, veuillez recréer le message de leave")
                        ],
                        ephemeral: true
                    });
                };

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("DarkBlue")
                            .setDescription("Le message de départ a été envoyé avec succès !")
                    ]
                })

                client.func.mod.sendLeaveMessage(interaction.guildId, interaction.guild.members.cache.get(interaction.user.id))
            }break;
            case "parametre" : {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Liste de tout les paramètres pour les messages de départ.")
                            .setColor("White")
                            .setDescription(`
                        {member-name} --> Pseudo du membre.
                        {member-tag} --> Pseudo + # du membre.
                        {member-id} --> Identifiant du membre.
                        {member-mention} --> Mentionne le membre.
                        {member-avatar} --> lien de l'avatar du membre.
                        {member-age} --> La date de création du compte.
                        `)
                    ],
                    ephemeral: true
                })
            }
        }
    }
}