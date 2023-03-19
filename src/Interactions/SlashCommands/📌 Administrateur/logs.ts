import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelType,
    ChatInputCommandInteraction, ComponentType, EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";
import {DiscordColor} from "../../../structures/Enumerations/Embed";
import ms from "ms";

export default {
    data: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Permet de définir les logs actifs pour ce serveur")
        .addChannelOption(
            opt => opt.setName('channel').setDescription("Le channel dans lequel sera envoyé les logs").addChannelTypes(ChannelType.GuildText).setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
        const logsName = Object.keys(guildData.logs);
        const channel = interaction.options.getChannel('channel');
        let paginationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("[no-check]logs#previous")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setLabel("⏪ Page précédente"),
            new ButtonBuilder()
                .setCustomId("[no-check]logs")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setLabel("1/5"),
            new ButtonBuilder()
                .setCustomId("[no-check]logs#next")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Page suivante ⏩"),
            new ButtonBuilder()
                .setCustomId("[no-check]logs2")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setLabel("‎‎"),
            new ButtonBuilder()
                .setCustomId("[no-check]logs#finish")
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Terminer")
        );
        let logsRows = [
            new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),
            new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),
            new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),
            new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>(),new ActionRowBuilder<ButtonBuilder>()
        ]
        let j = [
            [],[],[],[],[],
            [],[],[],[],[],
            [],[],[],[],[],
            [],[],[],[],[],
        ];
        let i = 0;
        let k = 0;
        logsName.map(name => {
            k += name.length;
            logsRows[i].addComponents(btncolor(name, i));
            if (k > 38 || j[i].length == 5) {
                i++;
                k = 0;
            }
        });

        const logEmbed = new EmbedBuilder()
            .setColor(DiscordColor.DarkBlue)
            .setTitle(`Modification des logs du serveur`)
            .setDescription(`**Channel:** <#${channel.id}>\n**Code couleur des boutons:** \n🟥 Log Inactive\n🟩 Log active dans le channel choisi\n🟦 Log active dans un autre channel.`)

        interaction.reply({
            embeds: [
                logEmbed
            ],
            components: [
                logsRows[0],
                logsRows[1],
                logsRows[2],
                logsRows[3],
                paginationRow
            ]
        }).then(msg => logMain(msg))

        function logMain(msg) {
            msg.awaitMessageComponent({
                time: 60 * 1000,
                filter: i => i.customId.startsWith("[no-check]logs") && i.user.id == interaction.user.id,
                componentType: ComponentType.Button,
            })
                .then(inter => {
                    const choix = inter.customId.split('#')[1];
                    if (choix == "finish") {
                        interaction.fetchReply("@original").then(omsg => {
                            //@ts-ignore
                            omsg.components.map(r => r.components.map(b => b.data.disabled = true));
                            inter.update({
                                components: omsg.components
                            })
                        })
                    } else if (choix == "next") {
                        paginationRow.components[0].setDisabled(false)
                        paginationRow.components[1].setLabel((Number(paginationRow.components[1].data.label.split("/")[0])+1)+"/5")
                        paginationRow.components[2].setDisabled(Number(paginationRow.components[1].data.label.split("/")[0]) == 5)
                        inter.update({
                            components: [
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-4],
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-3],
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-2],
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-1],
                                paginationRow
                            ]
                        }).then(msg => logMain(msg))
                    } else if (choix == "previous") {
                        paginationRow.components[2].setDisabled(false)
                        paginationRow.components[1].setLabel((Number(paginationRow.components[1].data.label.split("/")[0])-1)+"/5")
                        paginationRow.components[0].setDisabled(Number(paginationRow.components[1].data.label.split("/")[0]) == 1)
                        inter.update({
                            components: [
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-4],
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-3],
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-2],
                                logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-1],
                                paginationRow
                            ]
                        }).then(msg => logMain(msg))
                    } else {
                        if (inter.component.style == ButtonStyle.Success) {
                            guildData.logs[inter.component.label] = null;
                        } else {
                            guildData.logs[inter.component.label] = channel.id
                        };
                        guildData.save();
                        logsRows[Number(choix)].components.find(x => x.data.label == inter.component.label).setStyle(guildData?.logs[inter.component.label] ? guildData.logs[inter.component.label] == channel.id ? ButtonStyle.Success : ButtonStyle.Primary : ButtonStyle.Danger)
                        if (Number(choix) < 4) {
                            inter.update({
                                components: [
                                    logsRows[0],
                                    logsRows[1],
                                    logsRows[2],
                                    logsRows[3],
                                    paginationRow
                                ]
                            }).then(msg => logMain(msg))
                        } else {
                            inter.update({
                                components: [
                                    logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-4],
                                    logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-3],
                                    logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-2],
                                    logsRows[(Number(paginationRow.components[1].data.label.split("/")[0]))*4-1],
                                    paginationRow
                                ]
                            }).then(msg => logMain(msg))
                        }
                    }
                })
                .catch(() => {
                    interaction.fetchReply("@original").then(omsg => {
                        //@ts-ignore
                        omsg.components.map(r => r.components.map(b => b.data.disabled = true));
                        interaction.editReply({
                            components: omsg.components
                        })
                    })
                })
        }

        function btncolor(name: string, position: number) {
            checkChannel()
            return new ButtonBuilder()
                .setLabel(name)
                .setStyle(guildData?.logs[name] ? guildData.logs[name] == channel.id ? ButtonStyle.Success : ButtonStyle.Primary : ButtonStyle.Danger)
                .setCustomId(`[no-check]logs_${name}#${position}`)
        }

        function checkChannel() {
            logsName.map(name => {
                if (interaction.guild.channels.cache.get(guildData.logs[name]))return;
                guildData.logs[name] = null;
            })
            guildData.save()
        }
    }
}