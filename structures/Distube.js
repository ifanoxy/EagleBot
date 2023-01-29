const { EmbedBuilder } = require("discord.js");
const { DisTube } = require("distube");

class EagleMusic extends DisTube {
    constructor(client) {
        super(client, {
            searchSongs: 10
        });
        this.EagleClient = client
        this.on("playSong", (queue, song) => {
            queue.textChannel.send({
                embeds: [
                    new EmbedBuilder().setColor("Gold")
                    .setTitle(`Joue la musique __${song.name}__`)
                    .setThumbnail(song.thumbnail)
                    .setDescription(`**Durée:** ${song.duration}\n**Nombre de likes:** ${song.likes}\n**Nombre de dislikes:** ${song.dislikes}\n**Lien de la vidéo:** [Cliquez-ici](${song.url})`)
                ]
            })
        })
    }

    async playSong(channel, string, option) {
        try {
            return await this.play(channel, string, option)
            this.play.lo
        } catch (err) {
            return 0
        }
    }
    checkInVoice(userId) {
        if (!userId.voice)return 0;
        if (!userId.voice.channel)return 0;
        return 1;
    }
}

module.exports = { EagleMusic }