const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-masssticker')
    .setDescription("Vous permet de limiter la gestion des stickers")
    .setDMPermission(false)
    .addSubcommandGroup(
        subGroup => subGroup.setName("create").setDescription("Limiter la création de sticker")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass sticker")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass sticker")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui créer trop de sticker").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
            .addStringOption(
                opt => opt.setName("frequence").setDescription("l'intervale de temps entre les créations de sticker. ex: '5/15s' ").setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
        subGroup => subGroup.setName("update").setDescription("Limiter la modification de sticker")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass sticker")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass sticker")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui modifie trop de sticker").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
            .addStringOption(
                opt => opt.setName("frequence").setDescription("l'intervale de temps entre les modifications de sticker. ex: '5/15s' ").setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
        subGroup => subGroup.setName("delete").setDescription("Limiter la suppression de sticker")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass sticker")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass sticker")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui supprime trop de sticker").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
            .addStringOption(
                opt => opt.setName("frequence").setDescription("l'intervale de temps entre les suppressions de sticker. ex: '5/15s' ").setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
        subGroup => subGroup.setName("all").setDescription("Limiter la création/modification/suppression de sticker")
        .addSubcommand(
            sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass sticker")
        )
        .addSubcommand(
            sub => sub.setName("on").setDescription("Permet d'activer l'anti mass sticker")
            .addStringOption(
                opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui modifie trop les stickers").setRequired(true).addChoices(
                    {name: "Derank", value: "derank"},
                    {name: "kick", value: "kick"},
                    {name: "ban", value: "ban"}
                )
            )
            .addBooleanOption(
                opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
            )
            .addStringOption(
                opt => opt.setName("frequence").setDescription("l'intervale de temps entre les modifications des stickers. ex: '5/15s' ").setRequired(true)
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
                    client.fonctions.desactivateAntiRaid("anti-massSticker", interaction, {status: false}, subGroup)
                }, 1000)
                if (i == subGroup_Array.length)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti mass Sticker avec succès !")
                        .setColor("Orange")
                    ],
                    ephemeral: true
                })
            } else {
                const frequence = interaction.options.getString("frequence");
                if (!client.fonctions.checkFrequence(frequence, "x/yt")) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Il y a une erreur dans la fréquence !")
                        .setDescription(`
                        la fréqence doit ressemblée à ceci:
                        
                        **x/ys**
                        x = nombre de Sticker
                        y = nombre de seconde
                        s = seconde

                        __exemple :__
                        5/15s --> *(5 stickers en 15 secondes)*
                        `)
                    ],
                    ephemeral: true
                });
                setTimeout(() => {
                    client.fonctions.activateAntiRaid(
                        "anti-massSticker", interaction,
                        {
                            status: true,
                            ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                            sanction: interaction.options.getString("sanction"),
                            frequence: interaction.options.getString("frequence"),
                        },
                        subGroup
                    );
                }, (i-1)*500)
                if (i == subGroup_Array.length)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti mass Sticker avec succès !")
                        .setColor("Green")
                    ],
                    ephemeral: true
                });
            };
            i++;
        };
    }
}