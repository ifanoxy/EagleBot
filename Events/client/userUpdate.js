const { User } = require("discord.js")
const { EagleClient } = require("../../structures/Client")

module.exports = {
    name: "userUpdate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {User} oldUser 
     * @param {User} newUser 
     */
    execute(client, oldUser, newUser) {
        if (oldUser.tag == newUser.tag)return;
        let database = client.managers.lastnameManager.getAndCreateIfNotExists(newUser.id, {userId: newUser.id});
        database.namelist.push([oldUser.tag, Date.now()]);
        database.save();
    }
}