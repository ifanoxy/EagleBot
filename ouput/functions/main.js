"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Functions_client;
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = __importDefault(require("./Utils"));
const Moderation_1 = __importDefault(require("./Moderation"));
const Logs_1 = __importDefault(require("./Logs"));
const EmbedCreator_1 = __importDefault(require("./EmbedCreator"));
class Functions {
    constructor(client) {
        _Functions_client.set(this, void 0);
        __classPrivateFieldSet(this, _Functions_client, client, "f");
        this.mod = new Moderation_1.default(client);
        this.utils = new Utils_1.default(client);
        this.log = new Logs_1.default(client);
        this.embedCreator = new EmbedCreator_1.default(this);
    }
}
exports.default = Functions;
_Functions_client = new WeakMap();
