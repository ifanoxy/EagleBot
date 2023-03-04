import {EagleClient} from "../../structures/Client";
import {User} from "discord.js";

export default {
    name: "userUpdate",
    execute(client: EagleClient, oldUser: User, newUser: User) {
        if (oldUser.tag == newUser.tag)return;
        let database = client.managers.lastnameManager.getAndCreateIfNotExists(newUser.id, {userId: newUser.id});
        database.namelist.push([oldUser?.tag, Date.now()]);
        database.save();
    }
}