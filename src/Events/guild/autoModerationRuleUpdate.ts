import {EagleClient} from "../../structures/Client";
import {AutoModerationRule, EmbedBuilder} from "discord.js";

export default {
    name: "autoModerationRuleUpdate",
    execute(client: EagleClient, oldAutoModerationRule: AutoModerationRule | null, newAutoModerationRule: AutoModerationRule) {
        const channel = client.func.log.isActive(newAutoModerationRule.guild.id, "AutoModerationRuleUpdate");
        if (!channel)return;
        let change: {
            enable?: {
                old: any,
                new: any,
            },
            name?: {
                old: any,
                new: any,
            },
            actions?: {
                remove: any,
                add: any,
            },
            channels?: {
                remove: any,
                add: any,
            },
            roles?: {
                remove: any,
                add: any,
            }
        } = {};
        if (oldAutoModerationRule?.name != newAutoModerationRule.name) change.name = {
            old: oldAutoModerationRule?.name,
            new: newAutoModerationRule.name,
        };
        if (oldAutoModerationRule?.exemptChannels.map(x => x.id).join("-") != newAutoModerationRule.exemptChannels.map(x => x.id).join("-")) change.channels = {
            remove: oldAutoModerationRule?.exemptChannels.difference(newAutoModerationRule.exemptChannels).map(x => {if(!oldAutoModerationRule?.exemptChannels.get(x.id))return; return oldAutoModerationRule?.exemptChannels.get(x.id).id}).filter(k => k != undefined),
            add: oldAutoModerationRule?.exemptChannels.difference(newAutoModerationRule.exemptChannels).map(x => {if(!newAutoModerationRule.exemptChannels.get(x.id))return; return newAutoModerationRule.exemptChannels.get(x.id).id}).filter(k => k != undefined),
        };if (oldAutoModerationRule?.exemptRoles.map(x => x.id).join("-") != newAutoModerationRule.exemptRoles.map(x => x.id).join("-")) change.roles = {
            remove: oldAutoModerationRule?.exemptRoles.difference(newAutoModerationRule.exemptRoles).map(x => {if(!oldAutoModerationRule?.exemptRoles.get(x.id))return; return oldAutoModerationRule?.exemptRoles.get(x.id).id}).filter(k => k != undefined),
            add: oldAutoModerationRule?.exemptRoles.difference(newAutoModerationRule.exemptRoles).map(x => {if(!newAutoModerationRule.exemptRoles.get(x.id))return; return newAutoModerationRule.exemptRoles.get(x.id).id}).filter(k => k != undefined),
        };
        if (oldAutoModerationRule?.enabled != newAutoModerationRule.enabled) change.enable = {
            old: oldAutoModerationRule?.enabled,
            new: newAutoModerationRule.enabled,
        };
        if (oldAutoModerationRule?.actions.map(x => x.type).join("-") != newAutoModerationRule.actions.map(x => x.type).join("-")) change.actions = {
            remove: oldAutoModerationRule?.actions.filter(a => !newAutoModerationRule.actions.map(act => act.type).includes(a.type)),
            add: newAutoModerationRule.actions.filter(a => !oldAutoModerationRule?.actions.map(act => act.type).includes(a.type)),
        };
        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${this.name}`).setTimestamp()
        if (change.name) logEmbed.addFields(
            {
                name: "Changement de nom",
                value: `Ancien: ${change.name.old}\nNouveau: ${change.name.new}`
            }
        );
        if (change.enable) logEmbed.addFields(
            {
                name: "Status",
                value: `Ancien: ${change.enable.old ? "Activé" : "Désactivé"}\nNouveau: ${change.enable.new ? "Activé" : "Désactivé"}`
            }
        );
        if (change.actions) logEmbed.addFields(
            {
                name: "Changement des actions",
                value: `Retirée(s): ${change.actions.remove.map(a => a.type == 1 ? "Message bloqué" : a.type == 2 ? "Envoie d'un message d'alert" : "Timeout l'utilisateur").join(" / ") || "Aucun change"}\nAjoutée(s): ${change.actions.add.map(a => a.type == 1 ? "Message bloqué" : a.type == 2 ? "Envoie d'un message d'alert" : "Timeout l'utilisateur").join(" / ") || "Aucun change"}`
            }
        );
        if (change.channels) logEmbed.addFields(
            {
                name: "Changement des channels ignoré",
                value: `Retiré(s): ${change.channels.remove.length < 10 ? change.channels.remove.map(x => `<#${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}\nAjouté: ${change.channels.add.length ? change.channels.add.map(x => `<#${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}`
            }
        );
        if (change.roles) logEmbed.addFields(
            {
                name: "Changement des roles ignoré",
                value: `Retiré(s): ${change.roles.remove.length < 10 ? change.roles.remove.map(x => `<@&${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}\nAjouté: ${change.roles.add.length ? change.roles.add.map(x => `<@&${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}`
            }
        );
        channel.send({
            embeds: [logEmbed]
        });
    }
}