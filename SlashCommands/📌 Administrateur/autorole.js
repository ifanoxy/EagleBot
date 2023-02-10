const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder, StringSelectMenuBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("auto-role")
    .setDMPermission(false)
    .setDescription("Permet de définir quel rôle sera ajouté automatiquement"),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId})

        interaction.reply({
            embeds: [
                createEmbed()
            ],
            components: [
                createRow()
            ]
        }).then(message => {
            mainAutoRoles(message)
        });

        function mainAutoRoles(message) {
            client.fonctions.askWithButton(message, createRow(), interaction)
            .then(inter => {
                if(!inter)return;
                switch (inter.customId.replace("[no-check]autoroles-","")) {
                    case "addrole" : {
                        return inter.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle("autoroles Ping | Ajout de role")
                                .setDescription("Vous pouvez ajouter jusqu'à 15 roles aux maximum !")
                                .setFooter({text: "Vous avez 2 minutes pour choisir vos roles"})
                                .setColor("Gold")
                            ],
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new RoleSelectMenuBuilder()
                                    .setroleTypes([roleType.GuildText, roleType.GuildAnnouncement])
                                    .setCustomId("[no-check]autoroles-addrole")
                                    .setMinValues(1)
                                    .setMaxValues(15 - guildData.autoroles.length)
                                )
                            ]
                        })
                        .then(message => {
                            return client.fonctions.askWithSelectMenurole(message, createRow(), inter, 120)
                            .then(inter2 => {
                                if (!inter2)return;
                                guildData.autoroles.push(...inter2.values);
                                guildData.save();
                                inter2.message.delete();
                                return interaction.editReply({
                                    embeds: [
                                        createEmbed()
                                    ],
                                    components: [
                                        createRow()
                                    ]
                                }).then(mainAutoRoles);
                            })
                        })
                    };
                    case "removerole" : {
                        return inter.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle("autoroles Ping | Suppression de role")
                                .setFooter({text: "Vous avez 2 minutes pour choisir vos roles"})
                                .setColor("Gold")
                            ],
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new StringSelectMenuBuilder()
                                    .setCustomId("[no-check]autoroles-removerole")
                                    .addOptions(
                                        guildData.autoroles.map(roleId => {
                                            return {
                                                label: interaction.guild.roles.cache.get(roleId).name,
                                                value: roleId,
                                            }
                                        })
                                    )
                                    .setMinValues(1)
                                    .setMaxValues(guildData.autoroles.length)
                                )
                            ]
                        })
                        .then(message => {
                            return client.fonctions.askWithSelectMenuString(message, createRow(), inter, 120)
                            .then(inter2 => {
                                if (!inter2)return;
                                guildData.autoroles = guildData.autoroles.filter(m => !inter2.values.includes(m));
                                guildData.save();
                                inter2.message.delete();
                                return interaction.editReply({
                                    embeds: [
                                        createEmbed()
                                    ],
                                    components: [
                                        createRow()
                                    ]
                                }).then(mainAutoRoles);
                            })
                        })
                    };
                    case "end" : {
                        return inter.update({
                            embeds: [
                                createEmbed().setColor("Green")
                            ],
                            components: []
                        })
                    };
                };
            });
        }

        function createEmbed() {
            let autorolesEmbed = new EmbedBuilder()
            .setTitle("Gestion des auto roles pour les arrivants")
            .setDescription("Les 'autoroles' sont des roles qui sont donnés automatiquement à un membre lorse qu'il rejoint.")
            .addFields(
                {
                    name: "Status",
                    value: guildData.autoroles.length > 0 ? "``Actif``" : "``Inactif``"
                },
                {
                    name: "Roles",
                    value: guildData.autoroles?.map(c => `<@&${c}>`).join("\n") || "Aucun Roles"
                }
            )
            .setColor("Blurple");

            return autorolesEmbed
        }


        function createRow() {
            let autorolesRow = new ActionRowBuilder()

            if (guildData.autoroles.length >= 15)
            {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]autoroles-addrole")
                    .setLabel("Ajouter un role")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
                )
            } else {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]autoroles-addrole")
                    .setLabel("Ajouter un role")
                    .setStyle(ButtonStyle.Primary)
                )
            }

            if (guildData.autoroles.length == 0)
            {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]autoroles-removerole")
                    .setLabel("Retirer un role")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
                )
            } else {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]autoroles-removerole")
                    .setLabel("Retirer un role")
                    .setStyle(ButtonStyle.Secondary)
                )
            }
            
            autorolesRow.addComponents(
                new ButtonBuilder()
                .setCustomId("[no-check]autoroles-end")
                .setStyle(ButtonStyle.Success)
                .setLabel("Terminer")
            )

            return autorolesRow
        }

        /**
         * {
                status: false,
                roles: []
              }
         */
    }
}