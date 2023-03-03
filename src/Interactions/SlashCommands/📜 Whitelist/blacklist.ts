import {ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, StageChannel} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("bl")
        .setDescription("Permet d'ajouter une personne à la blacklist")
        .setDMPermission(false)
        .addStringOption(
            option => option.setName("id").setDescription("entrez l'identifiant de la personne que vous shouaitez blacklist").setRequired(true)
        ).addStringOption(
            option => option.setName("raison").setDescription("entrez la raison pour laquelle vous shouaitez blacklist cette personne").setRequired(false)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const id = interaction.options.getString("id");
        if (!client.isSnowflake(id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Vous devez rentrer un identifiant !")
            ],
            ephemeral: true
        });

        if (client.isBlacklist(id))return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Cette identifiant est déjà dans la blacklist")
            ],
            ephemeral: true
        });
        const raison = interaction.options.getString("raison");

        client.guilds.cache.map(guild => {
            if (guild.members.cache.has(id)) {
                guild.members.cache.get(id).ban({reason: "Blacklist"}).catch(() => {
                    if (interaction.channel.type == ChannelType.GuildStageVoice)return;
                    interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(`Je n'ai pas pu bannir cette identifiant dans le serveur ${guild.name}`)
                        ]
                    })
                })
            }
        })

        client.managers.blacklistManager.getAndCreateIfNotExists(id, {
            userId: id,
            reason: raison || "pas de raison",
            authorId: interaction.user.id,
        }).save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Vous avez ajouté l'identifiant \`${id}\` à la blacklist`)
            ]
        });
    }
}