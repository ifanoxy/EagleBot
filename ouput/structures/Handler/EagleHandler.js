"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EagleHandler = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Events_1 = require("./Events");
const Functions_1 = __importDefault(require("./Functions"));
const SlashCommands_1 = require("./SlashCommands");
class EagleHandler {
    constructor(EagleClient) {
        this.EagleClient = EagleClient;
        this.slashCommandsHandler = new SlashCommands_1.SlashCommandsHandler(this);
        setTimeout(() => {
            this.EagleClient.log(`All Slash Commands successfully loaded`, chalk_1.default.redBright);
            this.eventHandler = new Events_1.EventsHandler(this);
            setTimeout(() => {
                this.EagleClient.log(`All Events successfully loaded`, chalk_1.default.redBright);
                this.functionsHandler = new Functions_1.default(this);
                setTimeout(() => {
                    this.EagleClient.log(`All Functions successfully loaded`, chalk_1.default.redBright);
                }, 200);
            }, 200);
        }, 200);
    }
    getFiles(path, handler) {
        this.EagleClient._fs.readdir(path, (err, files) => {
            if (err)
                throw err;
            files.map((file) => {
                if (file.endsWith(".disabled"))
                    return;
                if (file.endsWith(".ts"))
                    return handler.registerFile(`${path}/${file}`);
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`, handler);
            });
        });
    }
}
exports.EagleHandler = EagleHandler;
module.exports = { EagleHandler };
