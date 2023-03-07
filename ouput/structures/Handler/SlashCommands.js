"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandsHandler = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path = __importStar(require("path"));
const discord_js_1 = require("discord.js");
class SlashCommandsHandler {
    constructor(EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.SlashCommandsList = new discord_js_1.Collection();
        this.EagleHandler.getFiles(path.resolve(__dirname, "..", "..", "Interactions", "SlashCommands"), this);
    }
    registerFile(file) {
        const pull = require(file).default;
        if (file.endsWith(".public.js"))
            pull.execute = (interaction, client) => { interaction.reply({ embeds: [new discord_js_1.EmbedBuilder().setColor("DarkOrange").setDescription("Cette commande n'est pas disponible pour la version public !\n\n**[Commander EagleBot](https://discord.gg/eaglebot)**").setFooter({ text: "Eagle Bot", iconURL: client.user.avatarURL() })], ephemeral: true }); };
        if (pull.data.name) {
            this.SlashCommandsList.set(pull.data.name.toLowerCase(), pull);
            delete require.cache[require.resolve(file)];
        }
        this.EagleHandler.EagleClient.log(`Slash Commands - Reading ${pull.data.name} command`, chalk_1.default.blue);
    }
}
exports.SlashCommandsHandler = SlashCommandsHandler;
module.exports = { SlashCommandsHandler };
