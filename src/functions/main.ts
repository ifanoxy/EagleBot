import { EagleClient } from "../structures/Client";
import Utils from "./Utils"
import Moderation from "./Moderation";

export default class Functions {
    #client: EagleClient;
    mod: Moderation;
    utils: Utils;

    constructor(client: EagleClient) {
        this.#client = client;
        this.mod = new Moderation(client);
        this.utils = new Utils(client);
    }
}