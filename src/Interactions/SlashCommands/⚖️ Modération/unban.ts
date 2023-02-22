import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Vous permet de débanir un membre du serveur")
        .setDMPermission(false)
        .addStringOption(
            opt => opt.setName("utilisateur").setDescription("sélectionné l'utilisateur que vous souhaitez débannir").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        let choices: Array<{name: string, id: string}> = [];
        const bans = await interaction.guild.bans.fetch();
        bans.map(ban => choices.push({
                name: ban.user.tag,
                id: ban.user.id
            }))
        const filtered = choices.filter(choice => choice.name.startsWith(focusedValue) || choice.id.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: `${choice.name} | ${choice.id}`, value: choice.id })),
        );
    },
    execute(interaction: ChatInputCommandInteraction) {
        const unbanId = interaction.options.getString("utilisateur");
        interaction.guild.bans.remove(unbanId, `Demandé par ${interaction.user.tag} (${interaction.user.id})`)
            .then(user => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor("Green").setDescription(`L'utilisateur \`${user.tag}\` à été débanni du serveur par <@${interaction.user.id}> !`)
                    ]
                })
            })
            .catch((err) => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor("Orange").setDescription(`Il y a eu un problème lors du bannissement : ${err}`)
                    ],
                    ephemeral: true
                })
            })
    }
}