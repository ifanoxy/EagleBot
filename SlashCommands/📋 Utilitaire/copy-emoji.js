const { SlashCommandBuilder, PermissionsBitField, CommandInteraction, AttachmentBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("copy-emoji")
    .setDescription('permet de copier et émoji et de le créer sur votre serveur.')
    .setDMPermission(false)
    .addStringOption(
        opt => opt.setName("emoji").setDescription("insérez l'émoji que vous souhaitez copier").setRequired(true)
    )
    .addBooleanOption(
        opt => opt.setName("animé").setDescription("Est ce que l'émoji est animé")
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

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
                respond = respond.replace(regex)
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

            if (animated) {
                interaction.guild.emojis.create({
                    name: emojiName,
                    attachment: `https://cdn.discordapp.com/emojis/${emojiId}.gif`,
                    reason: `Copie effectué par ${interaction.user.tag}`
                })
                .then(emoji => {
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
                    interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`Il y a eu une erreur lors de la création de l'émoji !\n\nErreur: ${err}`)
                        ],
                        ephemeral: true
                    });
                });
            } else {
                interaction.guild.emojis.create({
                    name: emojiName ,
                    attachment: `https://cdn.discordapp.com/emojis/${emojiId}.png`,
                    reason: `Copie effectué par ${interaction.user.tag}`
                })
                .then(emoji => {
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
                    interaction.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`Il y a eu une erreur lors de la création de l'émoji !\n\nErreur: ${err}`)
                        ],
                        ephemeral: true
                    });
                })
            }
        }
    }
}