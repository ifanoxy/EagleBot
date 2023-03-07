"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            var guildData = client.managers.guildsManager.getIfExist(interaction.guildId);
            if (!guildData)
                return interaction.reply({ content: "Il y a un problème avec ce formulaire !" });
            const formData = guildData.form[interaction.customId.split('#')[1]];
            if (!formData)
                return interaction.reply({ content: "Il y a un problème avec ce formulaire !" });
            let formModal = new discord_js_1.ModalBuilder()
                .setTitle("Formulaire")
                .setCustomId("[no-check]form_modal");
            let i = 0;
            for (let TextInputData of formData.data) {
                formModal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                    .setStyle(TextInputData.style)
                    .setLabel(TextInputData.question)
                    .setRequired(TextInputData.required)
                    .setMaxLength(TextInputData.max)
                    .setMinLength(TextInputData.min)
                    .setCustomId(`${i}`)));
                i++;
            }
            interaction.showModal(formModal);
            interaction.awaitModalSubmit({
                time: 120 * 1000,
                filter: i => i.customId == "[no-check]form_modal",
            })
                .then(modalInter => {
                interaction.guild.channels.fetch(formData.channel)
                    .then(channel => {
                    let formEmbed = new discord_js_1.EmbedBuilder()
                        .setTitle(`Formulaire | Réponse de ${interaction.user.tag}`)
                        .setThumbnail(interaction.user.avatarURL())
                        .setDescription(`Lien vers le formulaire: **[cliquez-ici](${interaction.message.url})**`)
                        .setColor("Yellow")
                        .setTimestamp();
                    let i = 0;
                    for (let TextInputData of formData.data) {
                        formEmbed.addFields({
                            name: `${TextInputData.question}`,
                            value: modalInter.fields.getTextInputValue(`${i}`) || "Pas de réponse",
                        });
                        i++;
                    }
                    channel.send({
                        embeds: [formEmbed]
                    });
                    modalInter.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder().setColor("Green")
                                .setDescription("Vous réponse au formulaire à été envoyé avec succès !")
                        ],
                        ephemeral: true
                    });
                })
                    .catch(() => {
                    delete guildData.form;
                    guildData.save();
                });
            });
        });
    }
};
