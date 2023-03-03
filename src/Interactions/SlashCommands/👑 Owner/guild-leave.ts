import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("guild-leave")
        .setDescription("permet de faire quitter le bot d'un serveur.")
        .setDMPermission(false)
        .addStringOption(
            opt => opt.setName("guild").setDescription("Veuillez choisir le serveur que vous voulez quitter").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused();
        const choices = client.guilds.cache.map(x => ({name: x.name, id: x.id}))
        const filtered = choices.filter(choice => choice.name.includes(focusedValue) || choice.id.includes(focusedValue)).slice(0, 25);
        await interaction.respond(
            filtered.map(choice => ({ name: `${choice.name} - ${choice.id}`, value: choice.id})),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const id = interaction.options.getString("guild");
        const guild = client.guilds.cache.get(id);

        if(!guild)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("le serveur est introuvable !")
            ],
            ephemeral: true
        });
        guild.leave()
            .then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription("Vous venez de quitter le serveur avec succès !")
                    ]
                }).catch();
            })
            .catch((err) => {
                if (err.name == "Error [GuildOwned]") {
                    guild.delete()
                        .then(() => {
                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Yellow")
                                        .setDescription("Vous venez de quitter le serveur avec succès !")
                                ]
                            });
                        }).catch()
                }
            })
    }
}