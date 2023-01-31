const { SlashCommandsBuilder } = require('discord.js')
module.exports = {
    data: new SlashCommandsBuilder()
        .setName("auto-reply-delete")
        .setDescription("Vous permet de supprimer une question de l'auto reply")
        .addStringOption(
            option => option.setName("question").setDescription("la question que vous souhaitez supprimer").setRequire(true)
        ),
    execute(interaction, client) {
        
    }
}