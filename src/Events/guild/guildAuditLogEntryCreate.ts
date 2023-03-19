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
    Sticker, GuildScheduledEvent, ApplicationCommand, AutoModerationRule,
} from "discord.js";

type AuditLogEntryTarget = (Object|Guild|BaseChannel|User|Role|Invite|Webhook|GuildEmoji|Message|Integration|StageInstance|Sticker|
    GuildScheduledEvent|ApplicationCommand|AutoModerationRule)

export default {
    name: "guildAuditLogEntryCreate",
    execute(client: EagleClient, audit: GuildAuditLogsEntry, guild: Guild) {
        const channel = client.func.log.isActive(guild.id, AuditLogEvent[audit.action].toString())
        if (!channel)return;
        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("#2c2f33")
                    .setTitle(`Logs | ${AuditLogEvent[audit.action].toString()} - ${audit.actionType}`)
                    .setDescription(`
                    Action effectué par : <@${audit.executor?.id}> \`${audit.executor.tag}\`
                    Raison: *${audit.reason || 'Aucune raison'}*,   
                    ${audit.targetType ? this.targetSend(audit.target) : ""}
                    `)
                    .addFields(
                        audit.changes ?
                            {
                                name: "Changement",
                                value: audit.changes.map(changement => {
                                    return `${changement.key} :\n   Ancien: ${changement.old || 'Rien'}\n   Nouveau: ${changement.new || 'Rien'}`
                                }).join("\n\n")
                            } : null,
                        audit.extra ?
                            {
                                name: "Information supplémentaire",
                                value: audit.extra.toString(),
                            } : null,
                    )
                    .setTimestamp(audit.createdTimestamp)
            ]
        })
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
        } else {
            return `Autres: ${target.toString()}`
        }
    }
}