const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("last-name")
    .setDescription("Permet de voir les anciens pseudo enregistrer par le bot")
    .addStringOption(
        opt => opt.setName("id").setDescription("L'id de la personne que vous souhaitez rechercher").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(interaction, client) {
        const id = interaction.options.getString("id");
        const database = client.managers.lastnameManager.getIfExist(id);
        console.log(database);

        if (!database || database?.namelist.length == 0)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Liste des anciens pseudo de ${(await client.users.fetch(id)).tag || id}`)
                .setDescription(`**Cette utilisateur n'a aucun pseudo d'enregistré !**`)
                .setColor("Random")
                .setTimestamp()
            ]
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Liste des anciens pseudo de ${(await client.users.fetch(id)).tag}`)
                .setDescription(`${database.namelist.map(x => `**pseudo:** \`${x[0]}\` --> **Modifié le** <t:${x[1]}>`).join("\n")}`)
                .setColor("Random")
                .setTimestamp()
            ]
        });
    }
}