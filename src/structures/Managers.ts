import * as path from "path";
import { EagleClient } from "./Client";
import {
    Antiraid,
    Backup,
    Blacklist,
    Guilds,
    Lastname,
    Members,
    ModelTypes,
    Mute,
    Owner,
    Stats,
    Tickets,
    Whitelist
} from "./Interfaces/Managers";
import Manager from './Managers/main';

export default class Managers implements ModelTypes {

    EagleClient: EagleClient;
    actualModelLoad: number;
    guildsManager: Manager<Guilds>;
    antiraidManager: Manager<Antiraid>;
    backupManager: Manager<Backup>;
    lastnameManager: Manager<Lastname>;
    membersManager: Manager<Members>;
    muteManager: Manager<Mute>;
    ownerManager: Manager<Owner>;
    statsManager: Manager<Stats>;
    ticketsManager: Manager<Tickets>;
    whitelistManager: Manager<Whitelist>;
    blacklistManager: Manager<Blacklist>;

    constructor(EagleClient: EagleClient) {
        this.EagleClient = EagleClient;
        this.getFolders();
        this.actualModelLoad = 0;
    }

    getFolders() {
        this.EagleClient._fs.readdir(path.resolve(__dirname, "./Managers"), (err, files) => {
            if (err) throw err;
            files.filter(f => !f.includes(".")).forEach(dirName => this.registerManager(dirName))
        });
    }

    registerManager(dirName) {
        this[`${dirName}Manager`] = new Manager(this, dirName);
        delete require.cache[require.resolve("./Managers/main")];
    }

}