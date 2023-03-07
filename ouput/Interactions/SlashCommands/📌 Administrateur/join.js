"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("join")
        .setDescription("Permet de gérer les messages de bienvenue du serveur")
        .setDMPermission(false)
        .addSubcommandGroup(subGroup => subGroup
        .setName("setup")
        .setDescription("gérer le message lorsque les membres rejoignent")
        .addSubcommand(sub => sub.setName("activer").setDescription("Permet d'activer les messages de bienvenue")
        .addChannelOption(opt => opt.setName("channel").setDescription("le channel où seront envoyé les messages de bienvenue").setRequired(true).addChannelTypes(discord_js_1.ChannelType.GuildText))
        .addStringOption(opt => opt.setName("message").setDescription("le message qui sera envoyé"))
        .addStringOption(opt => opt.setName("embed").setDescription("L'embed qui sera envoyé").setAutocomplete(true)))
        .addSubcommand(sub => sub.setName("désactiver").setDescription("Permet désactiver les messages de bienvenue")))
        .addSubcommand(subGroup => subGroup
        .setName("parametre")
        .setDescription("Voir tout les paramètres pour les messages de join"))
        .addSubcommand(subGroup => subGroup
        .setName("test")
        .setDescription("Permet de testé le message de join")),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = client.managers.membersManager.getIfExist(interaction.user.id);
            const focusedValue = interaction.options.getFocused();
            let choices = [];
            if (!userData || Object.keys(userData.embeds).length == 0) {
                choices.push("Vous n'avez pas créer d'embed --> /embed-create");
            }
            else {
                choices = Object.keys(userData.embeds);
            }
            const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 25);
            yield interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
        });
    },
    execute(interaction, client) {
        var _a, _b;
        let database = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId
        });
        const subGroup = interaction.options.getSubcommandGroup() || interaction.options.getSubcommand();
        switch (subGroup) {
            case "setup":
                {
                    if (interaction.options.getSubcommand() == "activer") {
                        const channel = interaction.options.getChannel("channel");
                        const message = interaction.options.getString("message");
                        const embedName = interaction.options.getString("embed");
                        if (!message && !embedName)
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor("Red")
                                        .setDescription("Vous devez définir au moins un message ou un embed de bienvenue")
                                ],
                                ephemeral: true
                            });
                        if (embedName == "Vous n'avez pas créer d'embed --> /embed-create")
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor("DarkPurple")
                                        .setTitle("Vous n'avez pas d'embed créé")
                                        .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                                ],
                                ephemeral: true
                            });
                        if (embedName)
                            database.join.message.embed = client.managers.membersManager.getIfExist(interaction.user.id).embeds[embedName];
                        if (message)
                            database.join.message.content = message;
                        database.join.channelId = channel.id;
                        database.save();
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Vous avez activé les messages automatiques lors de l'arrivé d'un membre avec succès !")
                                    .setColor("Green")
                            ]
                        });
                    }
                    else {
                        database.join = null;
                        database.save();
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription("Vous avez enlever les messages automatiques lors de l'arrivé d'un membre")
                            ]
                        });
                    }
                }
                break;
            case "test":
                {
                    if (!database || !((_a = database.join) === null || _a === void 0 ? void 0 : _a.channelId))
                        return interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription("Il n'y a pas de message de join créé !")
                            ],
                            ephemeral: true
                        });
                    if (!interaction.guild.channels.cache.get((_b = database.join) === null || _b === void 0 ? void 0 : _b.channelId)) {
                        database.join = { channelId: null, message: { content: null, embed: null } };
                        database.save();
                        return interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription("Le channel a été supprimé ou est introuvable, veuillez recréer le message de join")
                            ],
                            ephemeral: true
                        });
                    }
                    ;
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Blue")
                                .setDescription('Le message de join a été envoyé avec succès !')
                        ]
                    });
                    client.func.mod.sendJoinMessage(interaction.guildId, interaction.guild.members.cache.get(interaction.user.id));
                }
                break;
            case "parametre": {
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle("Liste de tout les paramètres pour les messages de bienvenue.")
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
                });
            }
        }
    }
};
