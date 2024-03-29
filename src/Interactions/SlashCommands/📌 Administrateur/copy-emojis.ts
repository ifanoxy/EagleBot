import {ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("copy-emoji")
        .setDescription('permet de copier et émoji et de le créer sur votre serveur.')
        .setDMPermission(false)
        .addStringOption(
            opt => opt.setName("emoji").setDescription("insérez les émojis que vous souhaitez copier").setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let respond = interaction.options.getString('emoji');
        const animated = interaction.options.getBoolean('animé') || false;
        const regex = /\<(.*?)\>/;
        const emojiNameArray = [];
        const emojiIdArray = [];

        let finish = false
        while (!finish) {
            if (!regex.test(respond))
                finish = true
            else {
                emojiNameArray.push(regex.exec(respond)[1].split(":")[1])
                emojiIdArray.push(regex.exec(respond)[1].split(":")[2])
                respond = respond.replace(regex, "")
            }
        }

        if (emojiNameArray.length == 0)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("L'émoji que vous avez entré est invalide !")
            ],
            ephemeral: true
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder().setColor("Blurple").setDescription(`Création de ${emojiNameArray.length} émoji(s) en cours...`)
            ],
            ephemeral: true
        })

        for (let i of [...Array(emojiNameArray.length).keys()]) {
            let emojiName = emojiNameArray[i];
            let emojiId = emojiIdArray[i];

            try {
                interaction.guild.emojis.create({
                    name: emojiName,
                    attachment: `https://cdn.discordapp.com/emojis/${emojiId}.gif`,
                    reason: `Copie effectué par ${interaction.user.tag}`
                })
                    .then(emoji => {
                        if (interaction.channel.type == ChannelType.GuildStageVoice)return;
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Emoji copié avec succès")
                                    .setColor("Green")
                                    .setDescription(`L'émoji \`${emojiName}\` à été créer sur votre serveur\n\nEmoji : <a:${emoji.name}:${emoji.id}>`)
                            ]
                        })
                    })
                    .catch(err => {
                        client.error("Erreur lors de la création d'émoji (copy-emoji) : "+ err);
                        if (interaction.channel.type == ChannelType.GuildStageVoice)return;
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`Il y a eu une erreur lors de la création de l'émoji !\n\nErreur: ${err}`)
                            ]
                        });
                    });
            } catch {
                interaction.guild.emojis.create({
                    name: emojiName ,
                    attachment: `https://cdn.discordapp.com/emojis/${emojiId}.png`,
                    reason: `Copie effectué par ${interaction.user.tag}`
                })
                    .then(emoji => {
                        if (interaction.channel.type == ChannelType.GuildStageVoice)return;
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Emoji copié avec succès")
                                    .setColor("Green")
                                    .setDescription(`L'émoji \`${emojiName}\` à été créer sur votre serveur\n\nEmoji : <:${emoji.name}:${emoji.id}>`)
                            ]
                        })
                    })
                    .catch(err => {
                        client.error("Erreur lors de la création d'émoji (copy-emoji) : "+ err);
                        if (interaction.channel.type == ChannelType.GuildStageVoice)return;
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`Il y a eu une erreur lors de la création de l'émoji !\n\nErreur: ${err}`)
                            ]
                        });
                    })
            }
        }
    }
}