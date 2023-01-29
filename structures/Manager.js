const path = require("path");

class EagleManagers {
    constructor(EagleClient) {
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
        const { Manager } = require('./Managers/main');
        this[`${dirName}Manager`] = new Manager(this, dirName);
        delete require.cache[require.resolve("./Managers/main")];
    }
}

module.exports = { EagleManagers }