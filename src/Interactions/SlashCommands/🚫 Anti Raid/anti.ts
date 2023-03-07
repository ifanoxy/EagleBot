import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("anti")
        .setDescription("Vous permet de gérer l'anti raid")
        .addSubcommandGroup(
            subGroup => subGroup.setName("bot").setDescription("Permet d'activer l'anti bot.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti bot")
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti bot")
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
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
            subGroup => subGroup.setName("massban").setDescription("Permet d'activer l'anti mass ban.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass ban")
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti mass ban")
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
                                {name: "Derank", value: "derank"},
                                {name: "kick", value: "kick"},
                                {name: "ban", value: "ban"}
                            )
                        )
                        .addBooleanOption(
                            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                        )
                        .addStringOption(
                            opt => opt.setName("frequence").setDescription("l'intervale de temps entre les bannissement. ex: '5/15s' ").setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("masschannel").setDescription("Permet d'activer l'anti mass channel.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass emoji")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass channel").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti mass emoji")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass channel").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
                                {name: "Derank", value: "derank"},
                                {name: "kick", value: "kick"},
                                {name: "ban", value: "ban"}
                            )
                        )
                        .addBooleanOption(
                            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                        )
                        .addStringOption(
                            opt => opt.setName("frequence").setDescription("l'intervale de temps entre les créations de emoji. ex: '5/15s' ").setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("massemoji").setDescription("Permet d'activer l'anti mass emoji.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass emoji")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass emoji").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti mass emoji")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass emoji").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
                                {name: "Derank", value: "derank"},
                                {name: "kick", value: "kick"},
                                {name: "ban", value: "ban"}
                            )
                        )
                        .addBooleanOption(
                            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                        )
                        .addStringOption(
                            opt => opt.setName("frequence").setDescription("l'intervale de temps entre les créations de emoji. ex: '5/15s' ").setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("masskick").setDescription("Permet d'activer l'anti mass kick.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass kick")
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti mass kick")
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
                                {name: "Derank", value: "derank"},
                                {name: "kick", value: "kick"},
                                {name: "kick", value: "kick"}
                            )
                        )
                        .addBooleanOption(
                            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                        )
                        .addStringOption(
                            opt => opt.setName("frequence").setDescription("l'intervale de temps entre les kick. ex: '5/15s' ").setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("massrole").setDescription("Permet d'activer l'anti mass role.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass role")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass role").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti mass role")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass role").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
                                {name: "Derank", value: "derank"},
                                {name: "kick", value: "kick"},
                                {name: "ban", value: "ban"}
                            )
                        )
                        .addBooleanOption(
                            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                        )
                        .addStringOption(
                            opt => opt.setName("frequence").setDescription("l'intervale de temps entre les créations de role. ex: '5/15s' ").setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("masssticker").setDescription("Permet d'activer l'anti mass sticker.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass sticker")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass sticker").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti mass sticker")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti mass sticker").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
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
            subGroup => subGroup.setName("massunban").setDescription("Permet d'activer l'anti mass unban.").addSubcommand(
                sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass unban")
            )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti mass unban")
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
                                {name: "Derank", value: "derank"},
                                {name: "kick", value: "kick"},
                                {name: "unban", value: "unban"}
                            )
                        )
                        .addBooleanOption(
                            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                        )
                        .addStringOption(
                            opt => opt.setName("frequence").setDescription("l'intervale de temps entre les débannissements. ex: '5/15s' ").setRequired(true)
                        )
                )

        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("new-account").setDescription("Permet d'activer l'anti nouveau compte.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti new account")
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti new account")
                        .addStringOption(
                            opt => opt.setName('temps-minimum').setDescription("Le temps minimum de création du compte").setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("role-admin").setDescription("Permet d'activer l'anti role admin.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti admin")
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti admin")
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
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
            subGroup => subGroup.setName("webhook").setDescription("Permet d'activer l'anti webhook.")
                .addSubcommand(
                    sub => sub.setName("off").setDescription("Permet de désactiver l'anti webhook")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti webhook").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                )
                .addSubcommand(
                    sub => sub.setName("on").setDescription("Permet d'activer l'anti webhook")
                        .addStringOption(
                            opt => opt.setName("type").setDescription("Le type d'anti webhook").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre").setRequired(true).addChoices(
                                {name: "Derank", value: "derank"},
                                {name: "kick", value: "kick"},
                                {name: "ban", value: "ban"}
                            )
                        )
                        .addBooleanOption(
                            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
                        )
                )
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        this[interaction.options.getSubcommandGroup()](interaction, client);
    },

    bot(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.func.utils.desactivateAntiRaid("anti-bot", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti bot avec succès !")
                        .setColor("Orange")
                ],
                ephemeral: true
            });
        } else {
            client.func.utils.activateAntiRaid(
                "anti-bot", interaction,
                {
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti bot avec succès !")
                        .setColor("Green")
                ],
                ephemeral: true
            })
        }
    },

    massban(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.func.utils.desactivateAntiRaid("anti-massBan", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti mass ban avec succès !")
                        .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.func.utils.activateAntiRaid(
                "anti-massBan", interaction,
                {
                    frequence: interaction.options.getString("freqence"),
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti mass ban avec succès !")
                        .setColor("Green")
                ],
                ephemeral: true
            })
        }
    },

    masschannel(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let subGroup_Array = [interaction.options.getString("type")];
        const sub = interaction.options.getSubcommand();
        if (subGroup_Array[0] == "all") subGroup_Array = ["create", "update", "delete"];

        let i = 1;
        for (const subGroup of subGroup_Array) {
            if (sub === "off") {
                setTimeout(() => {
                    client.func.utils.desactivateAntiRaid("anti-massChannel", interaction, {status: false}, subGroup)
                }, 1000)
                if (i == subGroup_Array.length)
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous avez __Désactiver__ l'anti mass Channel avec succès !")
                                .setColor("Orange")
                        ],
                        ephemeral: true
                    })
            } else {
                const frequence = interaction.options.getString("frequence");
                if (!client.func.utils.checkFrequence(frequence, "x/yt")) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("Il y a une erreur dans la fréquence !")
                            .setDescription(`
                        la fréqence doit ressemblée à ceci:
                        
                        **x/ys**
                        x = nombre de channel
                        y = nombre de seconde
                        s = seconde
                        __exemple :__
                        5/15s --> *(5 channels en 15 secondes)*
                        `)
                    ],
                    ephemeral: true
                });
                setTimeout(() => {
                    client.func.utils.activateAntiRaid(
                        "anti-massChannel", interaction,
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
                                .setTitle("Vous avez __Activer__ l'anti mass Channel avec succès !")
                                .setColor("Green")
                        ],
                        ephemeral: true
                    });
            }
            i++;
        }
    },

    massemoji(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let subGroup_Array = [interaction.options.getString("type")];
        const sub = interaction.options.getSubcommand();
        if (subGroup_Array[0] == "all") subGroup_Array = ["create", "update", "delete"];

        let i = 1;
        for (const subGroup of subGroup_Array) {
            if (sub === "off") {
                setTimeout(() => {
                    client.func.utils.desactivateAntiRaid("anti-massEmoji", interaction, {status: false}, subGroup)
                }, 1000)
                if (i == subGroup_Array.length)
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous avez __Désactiver__ l'anti mass Emoji avec succès !")
                                .setColor("Orange")
                        ],
                        ephemeral: true
                    })
            } else {
                const frequence = interaction.options.getString("frequence");
                if (!client.func.utils.checkFrequence(frequence, "x/yt")) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("Il y a une erreur dans la fréquence !")
                            .setDescription(`
                        la fréqence doit ressemblée à ceci:
                        
                        **x/ys**
                        x = nombre de Emoji
                        y = nombre de seconde
                        s = seconde
                        __exemple :__
                        5/15s --> *(5 emojis en 15 secondes)*
                        `)
                    ],
                    ephemeral: true
                });
                setTimeout(() => {
                    client.func.utils.activateAntiRaid(
                        "anti-massEmoji", interaction,
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
                                .setTitle("Vous avez __Activer__ l'anti mass Emoji avec succès !")
                                .setColor("Green")
                        ],
                        ephemeral: true
                    });
            }
            i++;
        }
    },

    masskick(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.func.utils.desactivateAntiRaid("anti-massKick", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti mass kick avec succès !")
                        .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.func.utils.activateAntiRaid(
                "anti-massKick", interaction,
                {
                    frequence: interaction.options.getString("freqence"),
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti mass kick avec succès !")
                        .setColor("Green")
                ],
                ephemeral: true
            })
        }
    },

    massrole(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let subGroup_Array = [interaction.options.getString("type")];
        const sub = interaction.options.getSubcommand();
        if (subGroup_Array[0] == "all") subGroup_Array = ["create", "update", "delete"];

        let i = 1;
        for (const subGroup of subGroup_Array) {
            if (sub === "off") {
                setTimeout(() => {
                    client.func.utils.desactivateAntiRaid("anti-massRole", interaction, {status: false}, subGroup)
                }, 1000)
                if (i == subGroup_Array.length)
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Vous avez __Désactiver__ l'anti mass Role avec succès !")
                                .setColor("Orange")
                        ],
                        ephemeral: true
                    })
            } else {
                const frequence = interaction.options.getString("frequence");
                if (!client.func.utils.checkFrequence(frequence, "x/yt")) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("Il y a une erreur dans la fréquence !")
                            .setDescription(`
                        la fréqence doit ressemblée à ceci:
                        
                        **x/ys**
                        x = nombre de Role
                        y = nombre de seconde
                        s = seconde
                        __exemple :__
                        5/15s --> *(5 Roles en 15 secondes)*
                        `)
                    ],
                    ephemeral: true
                });
                setTimeout(() => {
                    client.func.utils.activateAntiRaid(
                        "anti-massRole", interaction,
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
                                .setTitle("Vous avez __Activer__ l'anti mass Role avec succès !")
                                .setColor("Green")
                        ],
                        ephemeral: true
                    });
            };
            i++;
        };
    },

    masssticker(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let subGroup_Array = [interaction.options.getString("type")];
        const sub = interaction.options.getSubcommand();
        if (subGroup_Array[0] == "all") subGroup_Array = ["create", "update", "delete"];

        let i = 1;
        for (const subGroup of subGroup_Array) {
            if (sub === "off") {
                setTimeout(() => {
                    client.func.utils.desactivateAntiRaid("anti-massSticker", interaction, {status: false}, subGroup)
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
                if (!client.func.utils.checkFrequence(frequence, "x/yt")) return interaction.reply({
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
                    client.func.utils.activateAntiRaid(
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
    },

    massunban(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.func.utils.desactivateAntiRaid("anti-massUnban", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti mass unban avec succès !")
                        .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.func.utils.activateAntiRaid(
                "anti-massUnban", interaction,
                {
                    frequence: interaction.options.getString("freqence"),
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti mass unban avec succès !")
                        .setColor("Green")
                ],
                ephemeral: true
            })
        }
    },

    "new-account"(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.func.utils.desactivateAntiRaid("anti-newAccount", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti new account avec succès !")
                        .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.func.utils.activateAntiRaid(
                "anti-newAccount", interaction,
                {
                    status: true,
                    ageMin: interaction.options.getBoolean("temps-minimum"),
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti new account avec succès !")
                        .setColor("Green")
                ],
                ephemeral: true
            })
        }
    },

    "role-admin"(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.func.utils.desactivateAntiRaid("anti-admin", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Désactiver__ l'anti admin avec succès !")
                        .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.func.utils.activateAntiRaid(
                "anti-admin", interaction,
                {
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vous avez __Activer__ l'anti admin avec succès !")
                        .setColor("Green")
                ],
                ephemeral: true
            })
        }
    },

    webhook(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let subGroup_Array = [interaction.options.getString("type")];
        const sub = interaction.options.getSubcommand();
        if (subGroup_Array[0] == "all") subGroup_Array = ["create", "update", "delete"];

        let i = 1;
        for (const subGroup of subGroup_Array) {
            if (sub === "off") {
                setTimeout(() => {
                    client.func.utils.desactivateAntiRaid("anti-webhook", interaction, {status: false}, subGroup)
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
                    client.func.utils.activateAntiRaid(
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
    },
}