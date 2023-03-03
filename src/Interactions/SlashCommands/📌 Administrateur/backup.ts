import {ChannelType, ChatInputCommandInteraction, EmbedBuilder, HexColorString, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";
import * as repl from "repl";

export default {
    data: new SlashCommandBuilder()
        .setName("backup")
        .setDescription("Vous permlet de gérer vos backup")
        .setDMPermission(false)
        .addSubcommand(
            sub => sub.setName("create").setDescription("permet de créer une backup")
                .addStringOption(
                    opt => opt.setName("nom").setDescription("Définissez le nom de la backup").setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('use').setDescription("permet d'utiliser une backup")
                .addStringOption(option =>
                    option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true).setAutocomplete(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('delete').setDescription("permet de supprimer une backup")
                .addStringOption(option =>
                    option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true).setAutocomplete(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('list').setDescription("permet de voir la liste des backup")
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        this[interaction.options.getSubcommand()](interaction, client)
    },

    async create(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const name = interaction.options.getString("nom");
        const hexColorCharging: HexColorString[] = ["#212748", "#114870", "#006998", "#008da5", "#00b0b1", "#2cd19c", "#57f287"];
        let description = [
            `Channels: \`0\`/\`${interaction.guild.channels.cache.size}\``,
            `Roles: \`0\`/\`${interaction.guild.roles.cache.size}\``,
            `Émojis: \`0\`/\`${interaction.guild.emojis.cache.size}\``,
            `Stickers: \`0\`/\`${interaction.guild.stickers.cache.size}\``,
            `Bans: \`0\`/\`${interaction.guild.bans.cache.size}\``
        ]
        let embed = new EmbedBuilder()
            .setTitle("Création d'une backup | En cours")
            .setDescription(description.join("\n"))
            .setTimestamp()
            .setColor(hexColorCharging[0])
        const reply = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });
        let i = 0;
        const ChannelsData = await interaction.guild.channels.fetch().then(channels => {
            return channels.filter(x => x.type == ChannelType.GuildCategory || !x.parent).map(channel => {
                i++;
                if (channel.type == ChannelType.GuildCategory) {
                    return {
                        name: channel.name,
                        type: channel.type,
                        id: channel.id,
                        topic: null,
                        position: channel.rawPosition,
                        permissions: channel.permissionOverwrites?.cache.toJSON(),
                        children: channel.children?.cache.map(child => {
                            i++;
                            return {
                                name: child.name,
                                type: child.type,
                                id: child.id,
                                // @ts-ignore
                                topic: child.topic || null,
                                position: child.position,
                                permissions: child.permissionOverwrites?.cache.toJSON()
                            }
                        })
                    }
                } else {
                    return {
                        name: channel.name,
                        type: channel.type,
                        id: channel.id,
                        // @ts-ignore
                        topic: channel.topic || null,
                        position: channel.position,
                        permissions: channel.permissionOverwrites?.cache.toJSON()
                    }
                }
            });
        });

        description[0] = `Channels: \`${i}\`/\`${interaction.guild.channels.cache.size}\``;
        i = 0;
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[1])]
        });

        const RolesData = await interaction.guild.roles.fetch().then(roles => {
            return roles.map(role => {
                i++;
                return {
                    name: role.name,
                    id: role.id,
                    color: role.color,
                    position: role.position,
                    icon: role.iconURL(),
                    permissions: role.permissions.toJSON(),
                    mentionable: role.mentionable,
                }
            })
        });

        description[1] = `roles: \`${i}\`/\`${interaction.guild.roles.cache.size}\``;
        i = 0;
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[2])]
        });

        const EmojisData = await interaction.guild.emojis.fetch().then(emojis => {
            return emojis.map(emoji => {
                i++;
                return {
                    name: emoji.name,
                    animated: emoji.animated,
                    url: emoji.url
                }
            })
        });

        description[2] = `Émojis: \`${i}\`/\`${interaction.guild.emojis.cache.size}\``;
        i = 0;
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[3])]
        });

        const StickerData = await interaction.guild.stickers.fetch().then(stickers => {
            return stickers.map(sticker => {
                i++;
                return {
                    name: sticker.name,
                    description: sticker.description,
                    url: sticker.url,
                    type: sticker.type,
                    format: sticker.format
                }
            })
        })

        description[3] = `Stickers: \`${i}\`/\`${interaction.guild.stickers.cache.size}\``;
        i = 0;
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[4])]
        });

        const BansData = await interaction.guild.bans.fetch().then(bans => {
            return  bans.map(ban => {
                i++
                return {
                    userId: ban.user.id,
                    reason: ban.reason,
                }
            })
        });

        description[4] = `Bans: \`${i}\`/\`${interaction.guild.bans.cache.size}\``
        i = 0;
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[5])]
        });

        let backupdata = client.managers.backupManager.getAndCreateIfNotExists(`${interaction.user.id}-${name}`, {
            userId: interaction.user.id,
            name: name,
        });
        backupdata.guild = {
            name: interaction.guild.name,
            ownerId: interaction.guild.ownerId,
            iconURL: interaction.guild.iconURL() || null,
        },
        backupdata.channels =  ChannelsData
        backupdata.roles = RolesData
        backupdata.emojis = EmojisData
        backupdata.bans = BansData
        backupdata.stickers = StickerData
        backupdata.save().then(() => {
            reply.edit({
                embeds: [embed.setColor(hexColorCharging[6]).setTitle("Création d'une backup | Terminé")]
            })
        })
    },

    use(interaction: ChatInputCommandInteraction, client: EagleClient) {

    },

    delete(interaction: ChatInputCommandInteraction, client: EagleClient) {

    },

    list(interaction: ChatInputCommandInteraction, client: EagleClient) {

    },
}