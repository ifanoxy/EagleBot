import {ButtonInteraction, CommandInteraction, GuildMember, MessageComponentInteraction, PermissionsBitField } from "discord.js";
import { EagleClient } from "../structures/Client";
import { DiscordColor } from "../structures/Enumerations/Embed";

export default class Moderation {
    #client: EagleClient;
    constructor(client: EagleClient) {
        this.#client = client;
    }

    executorIsOverCible(cible: GuildMember, executor: GuildMember) {
        const cibleWL: boolean = this.#client.isWhitelist(cible.id);
        const executorWL: boolean = this.#client.isWhitelist(executor.id);
        if (!cibleWL && executorWL)return true;
        if (!cibleWL && !executorWL || cibleWL && !executorWL)return false;
        const cibleOwner: boolean = this.#client.isOwner(cible.id);
        const excutorOwner: boolean = this.#client.isOwner(executor.id);
        if (!cibleOwner && excutorOwner)return true;
        return false
    }

    memberKicable(member: GuildMember, executor: GuildMember, interaction: CommandInteraction) {
        if (member.user.id == this.#client.user.id)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto expulser !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (!member.kickable)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission d'expulser cette personne !`,
                        color: DiscordColor.Red
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (!executor.permissions.has(PermissionsBitField.Flags.KickMembers))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous avez besoin de la permission \`Kick_Members\` pour utiliser cette commande !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (member.roles.highest.rawPosition >= executor.roles.highest.rawPosition)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre avec un role supérieur ou égal au votre !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (!this.executorIsOverCible(member, executor))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false
        }
        return true;
    };

    memberVoiceKicable(member: GuildMember, executor: GuildMember, interaction) {
        if (member.user.id == this.#client.user.id)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto déconnecter !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (member.kickable)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission de déconnecter cette personne !`,
                        color: DiscordColor.Red
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (!executor.permissions.has(PermissionsBitField.Flags.MoveMembers))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous avez besoin de la permission \`Move_Members\` pour utiliser cette commande !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (member.roles.highest.rawPosition >= executor.roles.highest.rawPosition)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre avec un role supérieur ou égal au votre !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (!this.executorIsOverCible(member, executor))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false
        }
        return true;
    };
}