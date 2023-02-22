import {ButtonInteraction, CommandInteraction, GuildMember, MessageComponentInteraction, PermissionsBitField } from "discord.js";
import { EagleClient } from "../structures/Client";
import { DiscordColor } from "../structures/Enumerations/Embed";

export default class Moderation {
    #client: EagleClient;
    constructor(client: EagleClient) {
        this.#client = client;
    }

    cibleRoleIsBetter(cible: GuildMember, executor: GuildMember) {
        if (cible.roles.highest.rawPosition >= executor.roles.highest.rawPosition)
            return true;
        else return false;
    }

    executorIsOverCible(cible: GuildMember, executor: GuildMember) {
        const cibleWL: boolean = this.#client.isWhitelist(cible.id);
        const executorWL: boolean = this.#client.isWhitelist(executor.id);
        if (!cibleWL && executorWL)return 2;
        if (cibleWL && !executorWL)return null;
        if (!cibleWL && !executorWL)return 1;
        const cibleOwner: boolean = this.#client.isOwner(cible.id);
        const executorOwner: boolean = this.#client.isOwner(executor.id);
        if (!cibleOwner && executorOwner)return 2;
        if (cibleOwner && !executorOwner)return null;
        return 1
    }

    memberBannable(member: GuildMember, executor: GuildMember, interaction: CommandInteraction) {
        if (member.user.id == this.#client.user.id)
        {
            interaction.reply({
                embeds: [{
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto bannir !`,
                        color: DiscordColor.Orange
                    }],
                ephemeral: true
            });
            return false;
        };
        if (!member.bannable)
        {
            interaction.reply({
                embeds: [{
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission de bannir cette personne !`,
                        color: DiscordColor.Red
                    }],
                ephemeral: true
            });
            return false;
        };
        const res = this.executorIsOverCible(member, executor)
        if (!res)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas bannir un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false
        }
        if (res == 2)return true;
        if (this.cibleRoleIsBetter(member, executor))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas bannir un membre avec un role supérieur ou égal au votre !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        return true;
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
        const res = this.executorIsOverCible(member, executor);
        if (!res)
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
        if (res == 2)return true
        if (this.cibleRoleIsBetter(member, executor))
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
        const res = this.executorIsOverCible(member, executor)
        if (!res)
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
        if (res == 2)return true;
        if (this.cibleRoleIsBetter(member, executor))
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
        return true;
    };
}