import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("role-everyone")
        .setDescription("Permet d'ajouter un rôle à tout les membres")
        .setDMPermission(false)
        .addRoleOption(
            option => option.setName("role").setDescription('définissez le rôle qui sera attribué à tout le monde').setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const role = interaction.options.getRole("role")
        if ((await interaction.guild.members.fetch(interaction.user.id)).roles.highest.position <= role.position)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Vous n'avez pas la permission d'ajouter ce rôle !")
            ],
            ephemeral: true
        });
        const members = await interaction.guild.members.fetch();
        let nbr = 0;
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Aqua")
                    .setTitle(`Ajout du rôle ${role.name} à tout le monde`)
                    .setDescription(`rôle donné à \`${nbr}\` personne`)
                    .setTimestamp()
                    .setFooter({text: "cette action peut prendre plusieurs minutes"})
            ]
        })
            .then(() => {
                members.map(m => {
                    const a = m.roles.add(role.id)
                    nbr++;
                    if (nbr % 10 == 0 && nbr != members.size)return;
                    else a.then(() => {
                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Aqua")
                                        .setTitle(`Ajout du rôle ${role.name} à tout le monde`)
                                        .setDescription(`rôle donné à \`${nbr}\` personnes`)
                                        .setTimestamp()
                                        .setFooter({text: "cette action peut prendre plusieurs minutes"})
                                ]
                            })
                        })
                        .catch(() => {})
                })
            })
    }
}