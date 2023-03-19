import {EagleClient} from "../../structures/Client";
import {
    GuildAuditLogsEntry,
    Guild,
    EmbedBuilder,
    AuditLogEvent,
    BaseChannel,
    User,
    Invite,
    Role,
    Webhook,
    GuildEmoji,
    Message,
    Integration,
    StageInstance,
    Sticker, GuildScheduledEvent, ApplicationCommand, AutoModerationRule
} from "discord.js";


type AuditLogEntryTarget = (Object|Guild|BaseChannel|User|Role|Invite|Webhook|GuildEmoji|Message|Integration|StageInstance|Sticker|
    GuildScheduledEvent|ApplicationCommand|AutoModerationRule)

export default {
    name: "guildAuditLogEntryCreate",
    execute(client: EagleClient, audit: GuildAuditLogsEntry, guild: Guild) {
        const channel = client.func.log.isActive(guild.id, AuditLogEvent[audit.action].toString())
        if (!channel) return;
        let embed = new EmbedBuilder()
            .setColor("#2c2f33")
            .setTitle(`Logs | ${AuditLogEvent[audit.action].toString()} - ${audit.actionType}`)
            .setDescription(`
                    Action effectué par : <@${audit.executor?.id}> \`${audit.executor.tag}\`
                    Raison: *${audit.reason || 'Aucune raison'}*,   
                    ${audit.targetType ? this.targetSend(audit.target) : ""}
                    `)
            .setTimestamp(audit.createdTimestamp)

        if (audit.changes && audit.actionType == "Update") {
            embed.addFields({
                name: "Changement",
                    value: audit.changes.map(changement => {
                        if (changement.old == changement.new || !changement.old && !changement.new)return null;
                    return `**${changement.key}** :\n> Ancien: ${typeof changement?.old == "object" ? "\n```md\n"+this.jsontoString(changement.old)+"\n```" : changement.old || 'Rien'}\n> Nouveau: ${typeof changement?.new == "object" ? "\n```md\n"+this.jsontoString(changement.new)+"\n```" : changement.new || 'Rien'}`
                }).filter(x => x != null).join("\n\n")
            })
        }
        if (audit.extra) {
            embed.addFields({
                name: "Information supplémentaire",
                value: "```md\n"+this.jsontoString(audit.extra)+"\n```",
            })
        }
        channel.send({
            embeds: [
                embed
            ]
        })
    },
    jsontoString(obj: {} | {}[]) {
        return main(obj);

        function main(object: {} | {}[], tab = "") {
            let i = 0;
            if (Array.isArray(object)) {
                return object.map(element => {
                    Object.entries(element).map(([key, value]) => {
                        i++;
                        if (typeof value == "object")return main(value, tab+"\t");
                        return `${tab}${i}. ${key} --> ${value}`
                    }).join("\n")
                }).join("\n")
            } else {
                return Object.entries(object).map(([key, value]) => {
                    i++;
                    if (typeof value == "object")return main(value, tab+"\t");
                    return `${tab}${i}. ${key} --> ${value}`
                }).join("\n")
            }
        }
    },
    targetSend(target: AuditLogEntryTarget) {
        if (target instanceof Guild) {
            return `Serveur: ${target.name} (${target.id})`
        } else if (target instanceof BaseChannel) {
            return `Channel: <#${target.id}> ([lien du channel](${target.url}))`
        } else if (target instanceof User) {
            return `Utilisateur: \`${target.tag}\` (${target.id})`
        } else if (target instanceof Role) {
            return `Role: <@${target.id}> (${target.id})`
        } else if (target instanceof Invite) {
            return `Invitation: créé par <@${target.inviterId}>, utilisation: \`${target.uses}\`. lien ${target.url}`
        } else if (target instanceof Webhook) {
            return `Webhook: ${target.name} (${target.id}) - channel: <#${target.channelId}>`
        } else if (target instanceof GuildEmoji) {
            return `Emoji: <:${target.name}:${target.id}> (${target.name}). Créé par ${target.author?.tag}`
        } else if (target instanceof Message) {
            return `Message: auteur: <@${target.author.id}>, channel: <#${target.channelId}>. ([lien du message](${target.url}))`
        } else if (target instanceof Integration) {
            return `Integration: compte: ${target.account?.name} (${target.type}). nom: ${target.name}`
        } else if (target instanceof StageInstance) {
            return `StageInstance: <#${target.channelId}>, topic: ${target.topic || "aucun"}.`
        } else if (target instanceof Sticker) {
            return `Sticker: ${target.name}. description: ${target.description}`
        } else if (target instanceof GuildScheduledEvent) {
            return `GuildScheduledEvent: <#${target.channelId}>, nom: ${target.name}. ([lien de l'event](${target.url}))`
        } else if (target instanceof ApplicationCommand) {
            return `ApplicationCommand: ${target.name}. description: ${target.description}.`
        } else if (target instanceof AutoModerationRule) {
            return `AutoModerationRule: ${target.name}.`
        } else if (target) {
            return `Autres:\n`+"```md\n"+this.jsontoString(target)+"\n```"
        }
    }
}