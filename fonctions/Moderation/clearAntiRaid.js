const { EagleClient } = require("../../structures/Client")

module.exports = {
    name: "clearAntiRaid",
    repeat: true,
    /**
     * 
     * @param {EagleClient} client 
     */
    execute(client) {
        const AntiRaidFiles = client._fs.readdirSync("./AntiRaid/frequence");
        for (let File of AntiRaidFiles) {
            const data = require(`../../AntiRaid/frequence/${File}`);
            try {
                if (Object.values(data).reduce((a,b) => a+b) != 0)return;
            }catch{}
            client._fs.rmSync(`./AntiRaid/frequence/${File}`);
        }
    }
}