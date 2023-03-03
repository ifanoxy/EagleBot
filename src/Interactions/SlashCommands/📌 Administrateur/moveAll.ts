import {ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("moveall")
        .setDescription("Permet de déplacer tout les membres de channel vocal")
        .setDMPermission(false)
        .addChannelOption(
            opt => opt.setName("channel").setDescription("ne pas définir pour déplacer dans votre channel").addChannelTypes(ChannelType.GuildVoice).setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const moveChannel = interaction.options.getChannel("channel") || (await interaction.guild.members.fetch(interaction.user.id))?.voice?.channel;

        if (!moveChannel)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Vous devez être dans un channel vocal ou définir un channel pour déplacer le membre vers celui-ci`)
            ],
            ephemeral: true
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription("Déplacement en cours des `"+interaction.guild.voiceStates.cache.size+"` membres en vocal")
            ],
            ephemeral: true
        })

        interaction.guild.voiceStates.cache.map(user => {
            user.setChannel(moveChannel.id, `Déplacé par ${interaction.user.tag}`).catch()
        })
    }
}