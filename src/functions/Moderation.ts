import {ButtonInteraction, CommandInteraction, GuildMember, MessageComponentInteraction, PermissionsBitField } from "discord.js";
import { EagleClient } from "../structures/Client";

export default class Moderation {
    #client: EagleClient;
    constructor(client: EagleClient) {
        this.#client = client;
    }

    /** null -> Bot doesn't has permission */
    memberKicable(member: GuildMember, executor: GuildMember) {
        if (member.kickable)return null;
        if (!member.permissions.has(PermissionsBitField.Flags.KickMembers))return false;
        if (member.roles.highest.rawPosition <= executor.roles.highest.rawPosition)return false;
        return true;
    };
}