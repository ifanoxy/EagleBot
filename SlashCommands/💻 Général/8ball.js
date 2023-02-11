const { SlashCommandBuilder } = require("discord.js");
const phraseList = [
'Comme je le vois oui.','Demander à nouveau plus tard.','Mieux vaut ne pas te le dire maintenant.',
'Impossible de prédire maintenant.','Concentrez-vous et demandez à nouveau.','Ne comptez pas dessus.','Il est certain.',
"C'est décidément ainsi.",'Le plus probable.','Ma réponse est non.','Mes sources disent non.','Perspectives pas très bonnes.','Perspectives bonnes.',
'Répondez brumeux, réessayez.','Les signes pointent vers Oui.','Très douteux.','Sans aucun doute.','Oui.','Oui définitivement.','Vous pouvez vous y fier.',
"Comment t'es-tu retrouvé dans cette situation","Demandez à votre maman - maman sait mieux","NON NON NON!!!","OUI OUI OUI!!!","Pariez votre maison dessus","Partir",
"Effectuer un tirage au sort","Si tu crois vraiment fort, oui","Pas avec cette attitude.",'"Pas d\'ignorance, pas de sublimation" - Confucius',"Vous seul pouvez décider",
"404 - Citation introuvable","Secoue-moi plus fort papa","Allez-y; ta vie en dépend","Hélas. Non.","Votre supposition est aussi bonne que la mienne","QUELQUE FAÇON, non.",
"Vous connaissez déjà la réponse","Est-ce vraiment la question que vous devriez vous poser ?","Les cochons volent-ils ?","-.-- . ...","-. ---",
"Cette connaissance m'est même cachée.","Tu ferais mieux de ne pas savoir","Te dire maintenant gâcherait tout le plaisir",'"_______" la réponse vide est un désastre',
"Seulement une fois que les dieux interviennent","Au coucher du soleil la réponse sera claire",'Putain non',"Pourquoi demandez-vous à un jouet de déterminer vos choix ?",
"Putain, qu'est-ce qui pourrait mal tourner ?",'Messi, mais.. non !',"Vous devez être stupide ou désespéré pour me demander.",
"Aidez-moi, je suis vivant et j'ai peur.",,"Sssuuuuurrreee ?","HA- Non.","Haï","c'est-à-dire","Ja","Nein","Un certain peut-être, peut-être.","Redemandez-moi dans 10 minutes.",
"Pourriez-vous reformuler la question ?","Ne retenez pas votre souffle.","Dans quelle mesure êtes-vous engagé dans ce plan d'action ?",
"Comment cela pourrait-il mal tourner ?","Courir! Maintenant! Ne regarde pas en arrière !","Les chances sont de 3720 contre 1 contre.",
"Nous avons essayé de vous joindre au sujet de la garantie prolongée de votre voiture.","Vous avez plus de chances d'être frappé par la foudre.","Seulement si tu crois",
"Une fois dans une lune bleue","À condition que personne ne s'en aperçoive, oui.","Ce ne serait pas la bonne chose à faire, mais bien sûr.",
"Oh, c'est horrible ! Comment pouvez-vous même demander cela? Mais oui, déprimant.","Pourquoi ai-je besoin de savoir cela ?",
"pour être honnête, ce problème ressemble à quelque chose qui est au-delà de mon aide, vous devriez voir un psychiatre ou quelque chose comme ça.",
"Demandez-moi encore hier.","Jouez à des jeux stupides, gagnez des prix stupides.",
"La nôtre n'est pas de raisonner pourquoi. Le nôtre n'est que de faire et de mourir.","Mettez-y le feu !","Consulter un médecin si les symptômes persistent.",
"Lancez-lui un gros caillou.","Cela ressemble à un problème avec vous","Je ne dirai pas si vous ne le faites pas","Ne disons pas et disons que nous l'avons fait",
"Je ne sais pas! Demandez à votre Père !","Choix du danseur","C'est ton enterrement","... ou, maintenant écoutez-moi sur celui-ci, nous tuons le bouffon.",
"Qui suis-je pour gâcher un bon moment ?","Tu devrais peut-être dormir dessus","Maman a dit non"
]
module.exports = {
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Posez votre question ^^")
    .addStringOption(
        opt => opt.setName("question").setDescription("la question que vous souhaitez poser").setRequired(true)
    ),
    execute(interaction, client) {

        interaction.reply(`
        Votre question: ${interaction.options.getString("question")}.

        Réponse: ${phraseList[between(0, phraseList.length)]}
        `)
        function between(min, max) {  
            return Math.floor(Math.random() * (max - min) + min) 
        }
    }
}