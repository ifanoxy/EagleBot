const chalk = require('chalk');
const path = require('path');

class FonctionHandler {
    constructor(EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.FonctionsList = new EagleHandler.EagleClient.Collection();
        this.EagleHandler.getFiles(
            path.resolve(__dirname, "..","..","fonctions"),
            this
        );
        setTimeout(() => {
            this.startFonction(this.FonctionsList, this.EagleHandler.EagleClient)
        }, 2500)
    }

    registerFile(file) {
        const pull = require(file);
        if (pull.name) {
            this.FonctionsList.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(file)]
        }
        console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.blue(`Fonctions - Reading ${pull.name} fonction`));
    }

    startFonction(list, client) {
        list = list.filter(f => f.repeat)

        setInterval(function myFunction() {
            list.map(file => {
                try {
                    file.execute(client)
                } catch (err) {
                    client.error(err)
                }
            })
            return myFunction;
          }(), 10 * 60 * 1000)
        
    }
}

module.exports = { FonctionHandler }