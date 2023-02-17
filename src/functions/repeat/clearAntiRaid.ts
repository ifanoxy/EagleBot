import { EagleClient } from "../../structures/Client";

module.exports = {
    name: "clearAntiRaid",
    execute(client: EagleClient) {
        const AntiRaidFiles = client._fs.readdirSync("./AntiRaid/frequence");
        for (let File of AntiRaidFiles) {
            const data = require(`../../AntiRaid/frequence/${File}`);
            try {
                if (Object.values(data).reduce((a: number, b: number) => a+b) != 0)return;
            }catch{}
            client._fs.rmSync(`./AntiRaid/frequence/${File}`);
        }
    }
}