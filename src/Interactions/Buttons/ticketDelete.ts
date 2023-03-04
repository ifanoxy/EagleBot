import {ButtonInteraction, EmbedBuilder} from "discord.js";
import {EagleClient} from "../../structures/Client";

export default {
    execute(interaction: ButtonInteraction, client: EagleClient) {
        interaction.reply({
            embeds: [
                new EmbedBuilder().setColor('Red').setDescription("Suppression du ticket..")
            ]
        }).then(() => {
            setTimeout(() => {
                interaction.channel.delete();
            }, 1000)
        })
    }
}