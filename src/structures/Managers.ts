import * as path from "path";
import { EagleClient } from "./Client";
import ModeltTypes, {Antiraid, Backup, Guilds, Lastname, Members, Mute, Owner, Stats, Tickets, Whitelist} from "./Interfaces/Managers";
import Manager from './Managers/main';
import ModelTypes from "./Interfaces/Managers";

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