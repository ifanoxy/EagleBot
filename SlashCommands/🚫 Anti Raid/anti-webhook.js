const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-webhook')
    .setDescription("Vous permet de limiter la gestion des webhooks")
    .addSubcommandGroup(
        subGroup => subGroup.setName("create").setDescription("Limiter la création de webhook")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass webhook")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass webhook")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui créer trop de webhook").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
        subGroup => subGroup.setName("update").setDescription("Limiter la modification de webhook")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass webhook")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass webhook")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui modifie trop de webhook").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
        subGroup => subGroup.setName("delete").setDescription("Limiter la suppression de webhook")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass webhook")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass webhook")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui supprime trop de webhook").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
        subGroup => subGroup.setName("all").setDescription("Limiter la création/modification/suppression de webhook")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass webhook")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass webhook")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui modifie trop les webhooks").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
        )
    )
    ,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!client.moderation.checkOwner(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être owner pour utiliser cette commande !")
            ],
            ephemeral: true
        });
        
        let subGroup_Array = [interaction.options.getSubcommandGroup()];
        const sub = interaction.options.getSubcommand();
        if (subGroup_Array[0] == "all") subGroup_Array = ["create", "update", "delete"];
        
        i = 1;
        for (const subGroup of subGroup_Array) {
            if (sub === "off") {
                setTimeout(() => {
                    client.fonctions.desactivateAntiRaid("anti-webhook", interaction, {status: false}, subGroup)
                }, 1000)
                if (i == subGroup_Array.length)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti mass Webhook avec succès !")
                        .setColor("Orange")
                    ],
                    ephemeral: true
                })
            } else {
                setTimeout(() => {
                    client.fonctions.activateAntiRaid(
                        "anti-webhook", interaction,
                        {
                            status: true,
                            ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                            sanction: interaction.options.getString("sanction"),
                        },
                        subGroup
                    );
                }, (i-1)*500)
                if (i == subGroup_Array.length)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti Webhook avec succès !")
                        .setColor("Green")
                    ],
                    ephemeral: true
                });
            };
            i++;
        };
    }
}