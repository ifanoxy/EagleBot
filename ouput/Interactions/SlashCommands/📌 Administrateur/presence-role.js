"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("presence-role")
        .setDescription("Ajouter un rôle aux membres qui ont un texte dans leur status")
        .setDMPermission(false)
        .addStringOption(opt => opt.setName("presence").setDescription("La présence qui sera détecté").setRequired(true))
        .addRoleOption(opt => opt.setName('role').setDescription("le rôle qui sera donné aux membres qui auront la presence").setRequired(true))
        .addStringOption(opt => opt.setName("type").setDescription("Le type de présence que le membre doit avoir").setRequired(true).addChoices({
        name: "inclus", value: "includes"
    }, {
        name: "égale", value: "equals"
    })),
    execute(interaction, client) {
        const presence = interaction.options.getString("presence");
        const roleId = interaction.options.getRole("role").id;
        const type = interaction.options.getString("type");
        let database = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId
        });
        database.presenceRole = {
            roleId: roleId,
            presence: presence,
            type: type,
        };
        database.save();
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Vous venez de définir le presence role\n\nRole: <@&${roleId}>\nPrésence: ${presence}\nType: ${type}`)
            ]
        }).then(() => {
            client.handlers.functionsHandler.startFonction([client.handlers.functionsHandler.FonctionsList.get("presencerole")], client);
        });
    }
};
