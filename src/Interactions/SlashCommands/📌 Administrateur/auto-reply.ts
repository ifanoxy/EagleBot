import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("autoreply")
        .setDescription("Vous permet de gérer les préponses automatiques aux messages")
        .setDMPermission(false)
        .addSubcommand(
            sub => sub
                .setName("create")
                .setDescription("Vous permet de créer une préponse automatique à un message")
                .addStringOption(
                    option => option.setName("question").setDescription("Quelle est la question que vous souhaitez répondre").setRequired(true)
                )
                .addStringOption(
                    option => option.setName("réponse").setDescription("Définissez la réponse à la question").setRequired(true)
                )
        )
        .addSubcommand(
            sub => sub
                .setName("delete")
                .setDescription("Vous permet de supprimer une question de l'auto reply")
                .addStringOption(
                    option => option.setName("question").setDescription("la question que vous souhaitez supprimer").setRequired(true).setAutocomplete(true)
                )
        )
        .addSubcommand(
            sub => sub
                .setName("list")
                .setDescription("Permet d'affichier la liste des questions avec leur réponse")
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        var guildData = client.managers.guildsManager.getIfExist(interaction.guildId);
        const focusedValue = interaction.options.getFocused();
        let choices = [];
        if (guildData.autoreply.length == 0) {
            choices.push("Vous n'avez pas créer d'auto reply --> /autoreply-create")
        } else {
            choices = guildData.autoreply.map(autorep => autorep.question)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
        });

        switch (interaction.options.getSubcommand()) {
            case "create" : {
                const question = interaction.options.getString("question");
                const reponse = interaction.options.getString("réponse");

                guildData.autoreply.push({
                    question: question,
                    reponse: reponse,
                });

                guildData.save()

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Vous venez d'ajouter un auto reply")
                            .setColor("#eb2384")
                            .addFields(
                                {
                                    name: "Question",
                                    value: `${question}`
                                },
                                {
                                    name: "Réponse",
                                    value: `${reponse}`,
                                }
                            )
                    ]
                });
            }break;
            case "delete" : {
                const question = interaction.options.getString("question");
                if (question == "Vous n'avez pas créer d'auto reply --> /autoreply-create")return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Vous n'avez pas créer d'auto reply")
                            .setColor("Blurple")
                            .setDescription(`Utilisez la commande ${client.application.commands.cache.filter(i => i.name == "autoreply-create").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
                    ]
                });
                guildData.autoreply = guildData.autoreply.filter(a => a.question != question);
                guildData.save();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Suppression d'un auto reply")
                            .setColor("Red")
                            .setDescription(`Vous avez retiré avec succès de l'auto reply la question :\n\`${question}\``)
                    ]
                });
            }break;
            case "list" : {
                if (guildData.autoreply.length == 0) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Vous n'avez créer aucun auto reply")
                            .setColor("Red")
                            .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "autoreply-create").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
                    ]
                })

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Voici la liste de vos auto reply :")
                            .setColor("#eb2384")
                            .addFields(
                                guildData.autoreply?.map(autorep => {
                                    return {
                                        name: autorep.question,
                                        value: autorep.reponse,
                                    }
                                }) || [{name:"Aucun autoreply", value: "/auto-reply create"}]
                            )
                    ]
                });
            }break;
        }
    }
}