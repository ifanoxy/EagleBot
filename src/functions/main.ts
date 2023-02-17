import { EagleClient } from "../structures/Client";
import Moderation from "./Moderation";

export default class Functions {
    #client: EagleClient;
    mod: Moderation;

    constructor(client: EagleClient) {
        this.#client = client;
        this.mod = new Moderation(client);
    }
}