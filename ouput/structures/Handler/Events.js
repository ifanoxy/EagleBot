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
exports.EventsHandler = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path = __importStar(require("path"));
class EventsHandler {
    constructor(EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.EagleHandler.getFiles(path.resolve(__dirname, "..", "..", "Events"), this);
    }
    registerFile(file) {
        const event = require(file).default;
        this.EagleHandler.EagleClient.on(event.name, (...args) => {
            try {
                event.execute(this.EagleHandler.EagleClient, ...args);
            }
            catch (e) {
                console.log(e);
            }
        });
        this.EagleHandler.EagleClient.log(`Events - Reading ${event.name} event`, chalk_1.default.blue);
        delete require.cache[require.resolve(file)];
    }
}
exports.EventsHandler = EventsHandler;
