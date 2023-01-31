const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Vous permet d'obtenir de l'aide sur les commandes")
    .setDMPermission(true),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const folders = client._fs.readdirSync("./SlashCommands")
        let SelectMenuHelp = new StringSelectMenuBuilder()
        .setCustomId("[no-check]help")
        .setPlaceholder("Choississez une catégorie")
        .setMaxValues(1)
        .addOptions(
            {
                label: "🏠 Accueil",
                value: "Accueil"
            }
        )

        let acceuilEmbed = new EmbedBuilder()
            .setColor("LightGrey")
            .setTitle("Menu d'aide pour les commandes")
            .setDescription(`
            **Voici les catégories de commandes :**

            ${folders.map(fold => `${fold} --> **${client._fs.readdirSync(`./SlashCommands/${fold}`).length} Commandes` ).join("**\n")}**

            Nombre de commandes total: **${folders.map(fold => client._fs.readdirSync(`./SlashCommands/${fold}`).length).reduce((a,b) => a+b, 0)}**
            `)
            .setFooter({text: "Eagle Bot", iconURL: "https://cdn.discordapp.com/icons/1067846719972323358/4fd19c96bc2efda9a40d4c58bc5e3158.webp?size=128"})
        
        for (let folder of folders) {
            SelectMenuHelp.addOptions(
                {
                    label: folder,
                    value: folder,
                }
            )
        }

        interaction.reply({
            embeds: [
                acceuilEmbed
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    SelectMenuHelp
                )
            ],
            ephemeral: true
        })
        .then(msg => {
            askSelectMenu(msg)
        })

        function askSelectMenu(msg) {
            msg.awaitMessageComponent({
                filter: i => i.customId == "[no-check]help",
                componentType: ComponentType.StringSelect,
                time: 60 * 1000
            })
            .then(async inter => {
                if (inter.values[0] == "Accueil") {
                    var embedCommands = acceuilEmbed
                } else {
                    const files = client._fs.readdirSync(`SlashCommands/${inter.values[0]}`)
                    var embedCommands = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`Aide des commandes ${inter.values[0]}`)
    
                    for (let file of files) {
                        const path = require(`../${inter.values[0]}/${file}`)
                        embedCommands.addFields(
                            {
                                name: `${client.application.commands.cache.filter(i => i.name == path.data.name).map(a => `</${a.name}:${a.id}>`)}`,
                                value: `${path.data.description}`
                            }
                        )
                    }
                }
                
                inter.update({
                    embeds: [embedCommands]
                }).then(msg => {
                    askSelectMenu(msg)
                })
            })
            .catch(() => {
                interaction.editReply({
                    components: [
                        new ActionRowBuilder().addComponents(
                            SelectMenuHelp.setDisabled(true)
                        )
                    ],
                });
            })
        }
    }
}