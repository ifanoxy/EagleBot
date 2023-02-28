import { EagleClient } from "../structures/Client";
import Utils from "./Utils"
import Moderation from "./Moderation";
import Logs from "./Logs";

export default class Functions {
    #client: EagleClient;
    mod: Moderation;
    utils: Utils;
    log: Logs;

    constructor(client: EagleClient) {
        this.#client = client;
        this.mod = new Moderation(client);
        this.utils = new Utils(client);
        this.log = new Logs(client);
    }
}