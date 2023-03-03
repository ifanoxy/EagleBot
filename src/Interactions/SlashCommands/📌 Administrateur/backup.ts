import {SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("backup")
        .setDescription("Vous permlet de gérer vos backup")
        .setDMPermission(false)

}