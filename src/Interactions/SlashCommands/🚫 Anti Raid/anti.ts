import {SlashCommandBuilder} from "discord.js";

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
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui ajoute le bot").setRequired(true).addChoices(
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
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui banni trop de personne").setRequired(true).addChoices(
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
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui créer trop de emoji").setRequired(true).addChoices(
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
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui créer trop de emoji").setRequired(true).addChoices(
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
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui kick trop de personne").setRequired(true).addChoices(
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
                            opt => opt.setName("type").setDescription("Le type d'anti mass emoji").setRequired(true).setChoices(
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
                            opt => opt.setName("type").setDescription("Le type d'anti mass emoji").setRequired(true).setChoices(
                                {name: "Create", value: "create"},
                                {name: "Delete", value: "delete"},
                                {name: "Update", value: "update"},
                                {name: "All", value: "all"},
                            )
                        )
                        .addStringOption(
                            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui créer trop de role").setRequired(true).addChoices(
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
            subGroup => subGroup.setName("massunban").setDescription("Permet d'activer l'anti mass unban.")
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("new-account").setDescription("Permet d'activer l'anti nouveau compte.")
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("role-admin").setDescription("Permet d'activer l'anti role admin.")
        )
        .addSubcommandGroup(
            subGroup => subGroup.setName("webhook").setDescription("Permet d'activer l'anti webhook.")
        )
}