const { AutoModerationRule, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");
const path = require("path");

module.exports = {
    name: "autoModerationRuleUpdate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {AutoModerationRule} oldParametre 
     * @param {AutoModerationRule} newParametre 
     */
    execute(client, oldParametre, newParametre) {
        if (oldParametre == null) return;
        const guildData = client.managers.guildsManager.getIfExist(newParametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.AutoModerationRuleUpdate) return;
        const channel = client.channels.cache.get(guildData.logs.channel.AutoModerationRuleUpdate);
        if (channel == null || channel == undefined) return;
        let changement = {};
        if (oldParametre.name != newParametre.name) changement.name = {
            old: oldParametre.name,
            new: newParametre.name,
        };
        if (oldParametre.exemptChannels.map(x => x.id).join("-") != newParametre.exemptChannels.map(x => x.id).join("-")) changement.channels = {
            remove: oldParametre.exemptChannels.difference(newParametre.exemptChannels).map(x => {if(!oldParametre.exemptChannels.get(x.id))return; return oldParametre.exemptChannels.get(x.id).id}).filter(k => k != undefined),
            add: oldParametre.exemptChannels.difference(newParametre.exemptChannels).map(x => {if(!newParametre.exemptChannels.get(x.id))return; return newParametre.exemptChannels.get(x.id).id}).filter(k => k != undefined),
        };if (oldParametre.exemptRoles.map(x => x.id).join("-") != newParametre.exemptRoles.map(x => x.id).join("-")) changement.roles = {
            remove: oldParametre.exemptRoles.difference(newParametre.exemptRoles).map(x => {if(!oldParametre.exemptRoles.get(x.id))return; return oldParametre.exemptRoles.get(x.id).id}).filter(k => k != undefined),
            add: oldParametre.exemptRoles.difference(newParametre.exemptRoles).map(x => {if(!newParametre.exemptRoles.get(x.id))return; return newParametre.exemptRoles.get(x.id).id}).filter(k => k != undefined),
        };
        if (oldParametre.enabled != newParametre.enabled) changement.enable = {
            old: oldParametre.enabled,
            new: newParametre.enabled,
        };
        if (oldParametre.actions.map(x => x.type).join("-") != newParametre.actions.map(x => x.type).join("-")) changement.actions = {
            remove: oldParametre.actions.filter(a => !newParametre.actions.map(act => act.type).includes(a.type)),
            add: newParametre.actions.filter(a => !oldParametre.actions.map(act => act.type).includes(a.type)),
        };
        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`).setTimestamp()
        if (changement.name) logEmbed.addFields(
            {
                name: "Changement de nom",
                value: `Ancien: ${changement.name.old}\nNouveau: ${changement.name.new}`
            }
        );
        if (changement.enable) logEmbed.addFields(
            {
                name: "Status",
                value: `Ancien: ${changement.enable.old ? "Activé" : "Désactivé"}\nNouveau: ${changement.enable.new ? "Activé" : "Désactivé"}`
            }
        );
        if (changement.actions) logEmbed.addFields(
            {
                name: "Changement des actions",
                value: `Retirée(s): ${changement.actions.remove.map(a => a.type == 1 ? "Message bloqué" : a.type == 2 ? "Envoie d'un message d'alert" : "Timeout l'utilisateur").join(" / ") || "Aucun changement"}\nAjoutée(s): ${changement.actions.add.map(a => a.type == 1 ? "Message bloqué" : a.type == 2 ? "Envoie d'un message d'alert" : "Timeout l'utilisateur").join(" / ") || "Aucun changement"}`
            }
        );
        if (changement.channels) logEmbed.addFields(
            {
                name: "Changement des channels ignoré",
                value: `Retiré(s): ${changement.channels.remove.length < 10 ? changement.channels.remove.map(x => `<#${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}\nAjouté: ${changement.channels.add.length ? changement.channels.add.map(x => `<#${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}`
            }
        );
        if (changement.roles) logEmbed.addFields(
            {
                name: "Changement des roles ignoré",
                value: `Retiré(s): ${changement.roles.remove.length < 10 ? changement.roles.remove.map(x => `<@&${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}\nAjouté: ${changement.roles.add.length ? changement.roles.add.map(x => `<@&${x}>`).join("\n") : "Trop pour afficher" || "Aucun"}`
            }
        );
        channel.send({
            embeds: [logEmbed]
        }); 
    }
}