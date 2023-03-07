"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "userUpdate",
    execute(client, oldUser, newUser) {
        if (oldUser.tag != newUser.tag) {
            let database = client.managers.lastnameManager.getAndCreateIfNotExists(newUser.id, { userId: newUser.id });
            database.namelist.push([oldUser === null || oldUser === void 0 ? void 0 : oldUser.tag, Date.now()]);
            database.save();
        }
        ;
    }
};
