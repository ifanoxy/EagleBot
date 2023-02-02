const { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
var Board = require("montecalro2048").Board;

module.exports = {
    data: new SlashCommandBuilder()
    .setName("2048")
    .setDescription("Vous permet de jouer à 2048"),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        let board = new Board([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]);

        const components = []

        for (let i = 0; i < 4; i++) {
            let row = new ActionRowBuilder()
            for (let k = 0; k < 4; k++) {
                row.addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(" ")
                    .setCustomId(`[no-check]2048_${i}.${k}`)
                    .setDisabled(true)
                )
            }
            components.push(row)
        }
        
        let movesComponents = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("[no-check]2048_left")
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("[no-check]2048_up")
            .setEmoji("⬆️")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("[no-check]2048_down")
            .setEmoji("⬇️")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("[no-check]2048_right")
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Secondary),
        )
        components.push(movesComponents)

        function boardToButton(board, components)
        {
            for (let i = 0; i < 4; i++)
            {
                let btn = components[i].components
                for (let k = 0; k < 4; k++)
                {
                    btn[k].data.label = board.position[i][k] == 0 ? " " : String(board.position[i][k])
                }
            }
            return Movable(components)
        }

        function Movable(components)
        {
            let btn = components[4].components;
            btn[0].data.disabled = !board.isLeftMovable();
            btn[3].data.disabled = !board.isRightMovable();
            btn[1].data.disabled = !board.isUpMovable();
            btn[2].data.disabled = !board.isDownMovable();
            return components
        }


        
        board.add();
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription("**2048** | Le jeu vient de commencer !")
                .setColor("Green")
            ],
            components: boardToButton(board, components),
            ephemeral: true
        }).then(msg => askPlay(msg));

        function askPlay(msg) {
            msg.awaitMessageComponent({
                time: 60 * 1000,
                componentType: ComponentType.Button,
                filter: i => i.customId.startsWith("[no-check]2048")
            })
            .then(inter => {
                let choix = inter.customId.split('_')[1]
                switch (choix) {
                    case "left" : {
                        choix = 3;
                    }break;
                    case "up" : {
                        choix = 0;
                    }break;
                    case "down" : {
                        choix = 2;
                    }break;
                    case "right" : {
                        choix = 1;
                    }break;
                }
                board.move(choix);
                board.add();
                if (board.isOvered()){
                    components.map(cpt => cpt.components.map(cp => cp.data.disabled = true))
                    inter.update({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription("Vous avez perdu !")
                            .setColor("Red")
                        ],
                        components: components
                    });
                    return;
                } 
                inter.update({components: boardToButton(board, components)})
                .then(msg => askPlay(msg))
            })
            .catch(() => {
                components.map(cpt => cpt.components.map(cp => cp.data.disabled = true))
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription("Le jeu s'est terminé !")
                        .setColor("Red")
                    ],
                    components: components
                });
                return;
            })
        }

    }
}