const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("morpion")
    .setDescription("Vous permet de jouez au morpion contre une personne")
    .addUserOption(
        opt => opt.setName("adversaire").setDescription("Définissez la personne contre qui vous voulez jouer").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        const allowed = [interaction.user.id, interaction.options.getUser("adversaire").id];
        const starter = Math.round(Math.random())
        const embeds = new EmbedBuilder()
        .setTitle("Morpion")
        .setDescription(`**La partie vient de commencer !**
        Elle oppose <@${allowed[0]}> (❌) et <@${allowed[1]}> (⭕)

        Ce sont les ${starter == 0 ? "❌" : "⭕"} qui commence *(par tirage au sort)*
        `)
        .setFooter({text: "Vous avez 45s pour jouer"});

        const components = [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_0.0")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_0.1")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_0.2")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_1.0")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_1.1")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_1.2")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_2.0")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_2.1")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
                new ButtonBuilder()
                .setCustomId("[no-check]morpion_2.2")
                .setStyle(ButtonStyle.Secondary)
                .setLabel(" "),
            ),
        ]

        interaction.reply({
            embeds: [
                embeds
            ],
            components: components
        })
        .then(msg => {
            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: i => i.user.id == allowed[starter],
                time: 45 * 1000,
            });

            collector.on("collect", inter => {
                inter.reply("a")
            });

            collector.on("ignore", inter => {
                if (!inter.customId.startsWith("[no-check]morpion_"))return;
                if (inter.user.id == allowed[starter == 0 ? 1 : 0])
                inter.reply({
                    content: "Ce n'est pas à ton tour de jouer.",
                    ephemeral: true
                });
                else
                inter.reply({
                    content: "Vous ne pouvez pas jouer, vous ne faites pas parti du jeu !",
                    ephemeral: true
                })
            });

        })
    }
}