const chalk = require("chalk");
const path = require("path");

class AntiraidHandler {
    constructor (antiraidClient) {
        this.antiraidClient = antiraidClient;
        this.getFiles(path.resolve(__dirname, "..", "..", "AntiRaid","events"), this)
    }

    registerFile(file) {
        const event = require(file);
        this.antiraidClient.on(
        event.name,
        (...args) => {
            try {
            event.execute(this.antiraidClient, ...args, Math.round(new Date().getTime()/1000));
            } catch (e) {
            console.log(e);
            }
        }
        );
        this.antiraidClient.log(`Events - Reading ${event.name} event`, chalk.blue);
        delete require.cache[require.resolve(file)];
    }

    getFiles(path, handler) {
        this.antiraidClient._fs.readdir(path, (err, files) => {
        if (err) throw err;
            files.map((file) => {
                if (file.endsWith(".disabled")) return;
                if (file.endsWith(".js") && files !== "anticrash")
                    return handler.registerFile(`${path}/${file}`, this.antiraidClient);   
                if (!file.includes(".")) this.getFiles(`${path}/${file}`, handler);
            })
        });
    }
}

module.exports = { AntiraidHandler }