const Discord = require('discord.js')
const bot = new Discord.Client()
const axios = require('axios')

const prefix = "//"

bot.on('ready', () => {
    console.log("je suis connecté")
    bot.user.setActivity(prefix + "info", { type: "WATCHING" })
})


bot.on('message', message => {

    if (message.content.startsWith('salut Ordis') | message.content.startsWith('Salut Ordis')) {
        message.reply("Salut cher ami")
    }

    if (message.content.startsWith(prefix + "info")) {
        //message.delete(500)
        let embed = new Discord.RichEmbed()
            .setTitle("Info du bot")
            //.setThumbnail("")
            .setColor('#0101F2')
            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Question_mark_alternate.svg/90px-Question_mark_alternate.svg.png")
            .setAuthor(message.author.tag, message.author.avatarURL)
            .addField("Pour voir toutes mes commandes, refererez-vous au google docs suivant : ", "https://docs.google.com/document/d/12dcfb8q3u0O6nMirGLv3KgONro0eTcFpO7vux3bS_Jw/edit?usp=sharing")
            .addField("Nombre de membres sur le discord : ", message.guild.memberCount)
            .addField("Nombre de rôles : ", message.guild.roles.size + " => " + message.guild.roles.map(roles => "  " + roles.name))
            .setFooter(message.author.tag + ", vous êtes sur le salon " + message.channel.name)
            .setTimestamp()
        message.guild.channels.find("name", "commande-bot").send(embed)
    }

    if (message.content.startsWith(prefix + "degats")) {
        //message.delete(500)
        if (message.channel.name != "commande-bot") {
            message.channel.send(message.author + ", merci de regarder le channel #commande-bot")
        }
        message.guild.channels.find("name", "commande-bot").send("Pour utiliser **//degats**, il est nécessaire d\'avoir ces informations : le montant exact de chaque type de dégât qu\'inflige votre arme.\nAvez-vous tout cela ? **__Oui/Non__**")
            .then(function () {
                message.guild.channels.find("name", "commande-bot").awaitMessages(() => message.content, {
                    max: 1,
                    time: 20000,
                    errors: ['time'],
                }).then((collected) => {
                    if (collected.first().content == 'Oui' || collected.first().content == 'oui') {
                        message.guild.channels.find("name", "commande-bot").send("Veuillez entrer les données suivantes : __dégâtsPerfo__[**, **__dégâtsImpact__[**, **__...__]]\nMerci de respecter ce pattern.")
                            .then(function () {
                                message.guild.channels.find("name", "commande-bot").awaitMessages(() => message.content, {
                                    max: 1,
                                    time: 60000,
                                    errors: ['time'],
                                }).then((collect) => {
                                    let embed = new Discord.RichEmbed()
                                        .setTitle("Dégâts de l'arme :")
                                        .setColor('#0EF508')
                                        .addField("L'arme fait un total de ", calcul_degats(collect.first().content) + " dégâts.")
                                    message.guild.channels.find("name", "commande-bot").send(embed)
                                }).catch(function () {
                                    message.guild.channels.find("name", "commande-bot").send("Commande annulée : Informations manquantes :confused:")
                                })
                            })
                    } else {
                        if (collected.first().content == 'Non' || collected.first().content == 'non') {
                            message.guild.channels.find("name", "commande-bot").send("Dans ce cas, retapez la commande quand vous aurez toutes ces informations :wink:")
                        }
                    }
                }).catch(function () {
                    message.guild.channels.find("name", "commande-bot").send('Commande annulée : vous n\'avez pas répondu a la question.')
                })
            })
    }

    if (message.content.startsWith(prefix + "crit")) {
        //message.delete(500)
        if (message.channel.name != "commande-bot") {
            message.channel.send(message.author + ", merci de regarder le channel #commande-bot")
        }
        message.guild.channels.find("name", "commande-bot").send('Pour utiliser **//crit**, il est nécessaire d\'avoir ces informations : le montant exact de chaque type de dégât qu\'inflige votre arme ou le total (obtenable grâce a la commande **//degats**), le multiplicateur critique et le tiers de critique souhaité.\nAvez-vous tout cela ? **__Oui/Non__**')
            .then(function () {
                message.channel.awaitMessages(() => message.content, {
                    max: 1,
                    time: 20000,
                    errors: ['time'],
                }).then((collected) => {
                    if (collected.first().content == 'Oui' || collected.first().content == 'oui') {
                        message.guild.channels.find("name", "commande-bot").send("Veuillez entrer les données suivantes : __dégâts__[**, **__dégâtsImpact__[**, **__...__]]** ; **__multiplicateurCrit__**, **__tiersCrit__\nMerci de respecter ce pattern.")
                            .then(function () {
                                message.guild.channels.find("name", "commande-bot").awaitMessages(() => message.content, {
                                    max: 1,
                                    time: 60000,
                                    errors: ['time'],
                                }).then((collect) => {
                                    let embed = new Discord.RichEmbed()
                                        .setTitle("Dégâts de l'arme :")
                                        .setColor('#0EF508')
                                        .addField("L'arme fait un total de ", calcul_crit(collect.first().content) + " dégâts critiques")
                                    message.guild.channels.find("name", "commande-bot").send(embed)
                                }).catch(function () {
                                    message.guild.channels.find("name", "commande-bot").send("Commande annulée : Informations manquantes :confused:")
                                })
                            })
                    } else {
                        if (collected.first().content == 'Non' || collected.first().content == 'non') {
                            message.guild.channels.find("name", "commande-bot").send("Dans ce cas, retapez la commande quand vous aurez toutes ces informations :wink:")
                        }
                    }
                }).catch(function () {
                    message.guild.channels.find("name", "commande-bot").send('Commande annulée : vous n\'avez pas répondu a la question.')
                })
            })
    }

    if (message.content.startsWith(prefix + "armor")) {
        //message.delete(500)
        if (message.channel.name != "commande-bot") {
            message.channel.send(message.author + ", merci de regarder le channel #commande-bot")
        }
        message.guild.channels.find("name", "commande-bot").send("Pour utiliser **/armor**, il est nécessaire d'avoir ces informations : le niveau de base de l'ennemi (obtenable sur le wiki), le niveau de l'ennemi et l'armure de base de l'ennemi (obtenable via le Codex ingame) .\nAvez-vous tout cela ? **__Oui/Non__**")
            .then(function () {
                message.guild.channels.find("name", "commande-bot").awaitMessages(() => message.content, {
                    max: 1,
                    time: 20000,
                    errors: ['time'],
                }).then((collected) => {
                    if (collected.first().content == 'Oui' || collected.first().content == 'oui') {
                        message.guild.channels.find("name", "commande-bot").send("Veuillez entrer les données suivantes : __niveau de l'ennemi__**,** __niveau de base de l'ennemi__**, ** __armure de base de l'ennemi__\nMerci de respecter ce pattern.")
                            .then(function () {
                                message.guild.channels.find("name", "commande-bot").awaitMessages(() => message.content, {
                                    max: 1,
                                    time: 60000,
                                    errors: ['time'],
                                }).then((collect) => {
                                    let embed = new Discord.RichEmbed()
                                        .setTitle("Dégâts de l'arme :")
                                        .setColor('#0EF508')
                                        .addField("L'ennemi possède  ", calcul_armure(collect.first().content) + " d'armure")
                                        .addField("Le coefficient reducteur de dégâts est de ", coefficient(calcul_armure(collect.first().content)) + "%")
                                    message.guild.channels.find("name", "commande-bot").send(embed)
                                }).catch(function () {
                                    message.guild.channels.find("name", "commande-bot").send("Commande annulée : Informations manquantes :confused:")
                                })
                            })
                    } else {
                        if (collected.first().content == 'Non' || collected.first().content == 'non') {
                            message.guild.channels.find("name", "commande-bot").send("Dans ce cas, retapez la commande quand vous aurez toutes ces informations :wink:")
                        }
                    }
                }).catch(function () {
                    message.guild.channels.find("name", "commande-bot").send('Commande annulée : vous n\'avez pas répondu a la question.')
                })
            })
    }

    if (message.content.startsWith(prefix + "sondage")) {
        message.delete(1000)
            .then(function () {
                let args = message.content.split(" ").slice(1)
                let thingToEcho = args.join(" ")
                var embed = new Discord.RichEmbed()
                    .setTitle("Sondage créé par " + message.author.username)
                    .addField(thingToEcho, "Repondre avec :white_check_mark: ou :x:")
                    .setColor("#FF0200")
                    .setTimestamp()
                //message.channel.send("@here")
                message.guild.channels.find("name", "commande-bot").send(embed)
                    .then(function (message) {
                        message.react("✅")
                            .then(function () {
                                message.react("❌")
                            }).catch(function () {
                                message.channel.send("Une erreur est survenue. Merci de contacter un @Developpeur pour patcher ce bug.")
                            })
                    }).catch(function () {
                        message.channel.send("Syntaxe error")
                    })
            }).catch(function () {
                let embed = new Discord.RichEmbed()
                    .setTitle("Erreur de syntaxe !")
                    //.setThumbnail("")
                    .setDescription("Il faut un message derière **/sondage** pour executer la commande")
                message.channel.send(embed)
            })
    }

    if (message.content.startsWith(prefix + "wiki")) {
        //message.delete(500)
        var msg = ""
        msg = majuscule(message.content, msg)
        msg2 = msg.split(" ").join("_")
        let embed = new Discord.RichEmbed()
            .setTitle("**__Wiki__**")
            .setColor('#0101F2')
            .addField("Lien de la page du wiki pour " + msg + " :", "https://warframe.fandom.com/wiki/" + msg2)
        message.channel.send(embed)
    }

    if (message.content.startsWith(prefix + "clear")) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send("Vous n'avez pas la permission d'effectuer cette commande. Veuillez vous référer aux membres ayant la permission \"Gerer les messages\".")
        } else {
            var effacer = message.content.split(" ")
            if (parseInt(effacer[1]) > 99) {
                message.channel.bulkDelete(100)
                effacer[1] = effacer[1] - 100
            } else {
                message.channel.bulkDelete(parseInt(effacer[1]) + 1)
                //message.channel.send("J'ai effacé " + (parseInt(effacer[1]) + 1) + " messages !")
                //message.channel.send("@everyone Je peux maintenant calculer les degats de votre arme grâce à la commande /degats :grin:")
            }
        }
    }

    if (message.content.startsWith(prefix + "cetus")) {
        //message.delete(500)
        axios.get('https://api.warframestat.us/pc/cetusCycle')
            .then((response) => {
                //console.log(response)
                var chaine = response.data.shortString.split(" ")
                if (response.data.isDay == true) {
                    let embed = new Discord.RichEmbed()
                        .setTitle("Cycle Cetus : **Jour**")
                        .setColor("#ffe387")
                        .setThumbnail("https://vignette.wikia.nocookie.net/warframe/images/3/32/OstronSyndicateFlag.png/revision/latest?cb=20171017012540")
                        .addField("Il fait actuellement jour sur Cetus.", "Temps restant : " + chaine[0] + ".")
                    message.guild.channels.find("name", "commande-bot").send(embed)
                } else {
                    let embed = new Discord.RichEmbed()
                        .setTitle("Cycle Cetus : **Nuit**")
                        .setColor("#0c0963")
                        .setThumbnail("https://vignette.wikia.nocookie.net/warframe/images/3/32/OstronSyndicateFlag.png/revision/latest?cb=20171017012540")
                        .addField("Il fait actuellement nuit sur Cetus", "Temps restant : " + chaine[0] + ".")
                    message.guild.channels.find("name", "commande-bot").send(embed)
                }
            }).catch(function () {
                let embed = new Discord.RichEmbed()
                    .setTitle("Une erreur est survenue !")
                    //.setThumbnail("")
                    .setDescription("Contactez un " + message.guild.roles.find("name", "Developper").name + " pour corriger ce problème.")
                message.guild.channels.find("name", "commande-bot").send(embed)
            })
    }

    if (message.content.startsWith(prefix + "prix")) {
        //message.delete(500)
        var chaine = message.content.toLowerCase().split(" ").slice(1)
        var string = chaine.join(' ')
        var wiki = chaine.join('_')
        stringWfNexus = string.trim()
        stringWfMarket = wiki.trim()

        axios.get('https://api.warframe.market/v1/items/' + stringWfMarket + '/statistics')
            .then((response) => {
                //console.log(response)
                var res = response.data.payload.statistics_closed["48hours"]
                var taille = res.length
                var prix_moyen = res[taille - 1].avg_price
                //message.channel.send(prix_moyen)
                let embed = new Discord.RichEmbed()
                    .setTitle("Prix (warframe.market)")
                    .setURL("https://warframe.market/")
                    .addField(string, prix_moyen)
                message.channel.send(embed)
                //TODO embeds
            }).catch(function () {
                message.guild.channels.find("name", "commande-bot").send("L'item est introuvable")
            })
    }

    if (message.content.startsWith(prefix + "fissures")) {
        //message.delete(500)
        axios.get("https://api.warframestat.us/pc/fissures")
            .then((response) => {
                //console.log(response)
                msg = ""
                for (i = 0; i < response.data.length; i++) {
                    ennemie = response.data[i].enemy
                    mission = response.data[i].missionType
                    if (response.data[i].missionType != "Extermination") {
                        wiki = mission.split(" ").join("_")
                    } else {
                        wiki = "Exterminate"
                    }
                    nom = response.data[i].node
                    tmpRestant = response.data[i].eta
                    tier = response.data[i].tier
                    msg = msg + "[" + tier + " " + ennemie + " " + mission + "](https://warframe.fandom.com/wiki/" + wiki + "), " + nom + ".\nExpire dans " + tmpRestant + "\n"
                }
                let embed = new Discord.RichEmbed()
                    .setTitle("Fissures")
                    .setURL("https://warframe.fandom.com/wiki/Void_Fissure")
                    .setColor('#ffd642')
                    .setDescription(msg)
                    .setThumbnail("https://vignette.wikia.nocookie.net/warframe/images/5/57/VoidTearIcon_b.png/revision/latest?cb=20160713085454")
                message.guild.channels.find("name", "commande-bot").send(embed)
            }).catch(function () {
                let embed = new Discord.RichEmbed()
                    .setTitle("Une erreur est survenue !")
                    //.setThumbnail("")
                    .setDescription("Contactez un " + message.guild.roles.find("name", "Developper").name + " pour corriger ce problème.")
                message.guild.channels.find("name", "commande-bot").send(embed)
            })
    }

    if (message.content.startsWith(prefix + "nightwaves")) {
        axios.get("https://api.warframestat.us/pc/nightwave")
            .then((response) => {
                //console.log(response.data)
                let embed = new Discord.RichEmbed()
                    .setTitle("**__Nightwaves__**")
                    .setURL("https://semlar.com/challenges")
                    .setThumbnail("https://vignette.wikia.nocookie.net/warframe/images/e/e0/NightwaveSyndicate.png/revision/latest?cb=20190228190906")
                    .addField(response.data.activeChallenges[0].title + " (" + response.data.activeChallenges[0].reputation + ") :", response.data.activeChallenges[0].desc)
                    .addField(response.data.activeChallenges[1].title + " (" + response.data.activeChallenges[1].reputation + ") :", response.data.activeChallenges[1].desc)
                    .addField(response.data.activeChallenges[2].title + " (" + response.data.activeChallenges[2].reputation + ") :", response.data.activeChallenges[2].desc)
                    .addField(response.data.activeChallenges[3].title + " (" + response.data.activeChallenges[3].reputation + ") :", response.data.activeChallenges[3].desc)
                    .addField(response.data.activeChallenges[4].title + " (" + response.data.activeChallenges[4].reputation + ") :", response.data.activeChallenges[4].desc)
                    .addField(response.data.activeChallenges[5].title + " (" + response.data.activeChallenges[5].reputation + ") :", response.data.activeChallenges[5].desc)
                    .addField(response.data.activeChallenges[6].title + " (" + response.data.activeChallenges[6].reputation + ") :", response.data.activeChallenges[6].desc)
                    .addField(response.data.activeChallenges[7].title + " (" + response.data.activeChallenges[7].reputation + ") :", response.data.activeChallenges[7].desc)
                    .addField(response.data.activeChallenges[8].title + " (" + response.data.activeChallenges[8].reputation + ") :", response.data.activeChallenges[8].desc)
                    .addField(response.data.activeChallenges[9].title + " (" + response.data.activeChallenges[9].reputation + ") :", response.data.activeChallenges[9].desc)
                message.guild.channels.find("name", "commande-bot").send(embed)
            }).catch(function () {
                let embed = new Discord.RichEmbed()
                    .setTitle("Une erreur est survenue !")
                    //.setThumbnail("")
                    .setDescription("Contactez un " + message.guild.roles.find("name", "Developper").name + " pour corriger ce problème.")
                message.guild.channels.find("name", "commande-bot").send(embed)
            })
    }
    
    if (message.content.startsWith(prefix + "sortie")) {
        axios.get("https://api.warframestat.us/pc/sortie")
            .then((response) => {
                console.log(response)
                var sortie = response.data
                let embed = new Discord.RichEmbed()
                    .setTitle("**Sortie actuelle : " + sortie.faction + "\nBoss actuel : " + sortie.boss + "** ")
                    .setURL("https://warframe.fandom.com/wiki/Sortie")
                    .setColor('#ffd642')
                    .addField("Mission 1 : " + sortie.variants[0].missionType + ", " + sortie.variants[0].node, sortie.variants[0].modifier + "\n**__Description__** : " + sortie.variants[0].modifierDescription)
                    .addField("Mission 2 : " + sortie.variants[1].missionType + ", " + sortie.variants[1].node, sortie.variants[1].modifier + "\n**__Description__** : " + sortie.variants[1].modifierDescription)
                    .addField("Mission 3 : " + sortie.variants[2].missionType + ", " + sortie.variants[2].node, sortie.variants[2].modifier + "\n**__Description__** : " + sortie.variants[2].modifierDescription)
                    .setThumbnail("https://vignette.wikia.nocookie.net/warframe/images/1/15/Sortie_b.png/revision/latest?cb=20151217134250")
                message.guild.channels.find("name", "commande-bot").send(embed)
            }).catch(function () {
                let embed = new Discord.RichEmbed()
                    .setTitle("Une erreur est survenue !")
                    //.setThumbnail("")
                    .setDescription("Contactez un " + message.guild.roles.find("name", "Developper").name + " pour corriger ce problème.")
                message.guild.channels.find("name", "commande-bot").send(embed)
            })
    }    

    if (message.content.startsWith(prefix + "drops")) {
        axios.get("https://api.warframestat.us/drops/search/survival")
            .then((response) => {
                console.log(response.data[1000])
            })
    }

})

bot.on('raw', event => {
    var eventName = event.t
    //console.log(eventName)
    if (eventName == 'MESSAGE_REACTION_ADD') {
        if (bot.channels.get(event.d.channel_id).messages.has(event.d.message_id)) {
            //console.log("cached")
            return
        } else {
            //console.log("not cached")
            bot.channels.get(event.d.channel_id).fetchMessage(event.d.message_id)
                .then(msg => {
                    var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id)
                    var user = bot.users.get(event.d.user_id)
                    bot.emit('messageReactionAdd', msgReaction, user)
                })
        }
    }

    if (eventName == 'MESSAGE_REACTION_REMOVE') {
        if (bot.channels.get(event.d.channel_id).messages.has(event.d.message_id)) {
            //console.log("cached")
            return
        } else {
            //console.log("not cached")
            bot.channels.get(event.d.channel_id).fetchMessage(event.d.message_id)
                .then(msg => {
                    var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id)
                    var user = bot.users.get(event.d.user_id)
                    bot.emit('messageReactionRemove', msgReaction, user)
                })
        }
    }
})

bot.on('messageReactionAdd', (reaction, user) => {
    //console.log(reaction)
    switch (reaction.emoji.name) {
        case "TheDivision":
            var roleName = "The Division 2"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.addRole(role.id)
                }
            }
            break;

        case "RocketLeague":
            var roleName = "Rocket League"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.addRole(role.id)
                }
            }
            break;

        case "Warframe":
            var roleName = "Warframe"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.addRole(role.id)
                }
            }
            break;

        case "Trine":
            var roleName = "Trine"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.addRole(role.id)
                }
            }
            break;

        case "LoL":
            var roleName = "League of Legends"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.addRole(role.id)
                }
            }
            break;

        case "Satisfactory":
            var roleName = "Satisfactory"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.addRole(role.id)
                }
            }
            break;

        case "Dauntless":
            var roleName = "Dauntless"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.addRole(role.id)
                }
            }
            break;
    }
})

bot.on('messageReactionRemove', (reaction, user) => {
    //console.log(reaction)
    switch (reaction.emoji.name) {
        case "TheDivision":
            var roleName = "The Division 2"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.removeRole(role.id)
                }
            }
            break;

        case "RocketLeague":
            var roleName = "Rocket League"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.removeRole(role.id)
                }
            }
            break;

        case "Warframe":
            var roleName = "Warframe"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.removeRole(role.id)
                }
            }
            break;

        case "Trine":
            var roleName = "Trine"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.removeRole(role.id)
                }
            }
            break;

        case "LoL":
            var roleName = "League of Legends"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.removeRole(role.id)
                }
            }
            break;

        case "Satisfactory":
            var roleName = "Satisfactory"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.removeRole(role.id)
                }
            }
            break;

        case "Dauntless":
            var roleName = "Dauntless"
            var role = reaction.message.guild.roles.find(role => role.name.toLowerCase() == roleName.toLowerCase())
            if (role) {
                var member = reaction.message.guild.members.find(member => member.id == user.id)
                if (member) {
                    member.removeRole(role.id)
                }
            }
            break;
    }
})

bot.on('guildMemberAdd', (member) => {
    var role = member.guild.roles.find(role => role.name.toLowerCase() == "membres")
    member.addRole(role.id)
})

bot.on("guildMemberRemove", member => {
    member.guild.channels.find("name", "bienvenue").send(member + " vient de quitter le serveur :cry:. On ne l'oubliera jamais !\nIl etait un valeureux Tenno !")
})

bot.login(process.env.BOT_TOKEN)

function calcul_degats(chaine) {
    var degat = 0
    var chainetab = chaine.split(", ")
    for (i = 0; i < chainetab.length; i++) {
        degat = degat + parseInt(chainetab[i])
    }
    return degat
}

function calcul_crit(chaine) {
    var string = chaine.split(" ; ")
    var degat = calcul_degats(string[0])
    var critique = string[1].split(", ")
    var degats_crit = degat * (1 + parseInt(critique[1]) * (2 * parseInt(critique[0]) - 1))
    return degats_crit
}

function calcul_armure(chaine) {
    var valeurs = chaine.split(", ")
    var armure = parseInt(valeurs[2]) * (1 + (Math.pow(parseInt(valeurs[0]) - parseInt(valeurs[1]), 1.75) / 200))
    return armure
}

function coefficient(armure) {
    var reduc = (armure / (armure + 300)) * 100
    return reduc
}

function majuscule(originalMessage, msg) {
    //var msg = ""
    //var msg2 = ""
    var array = originalMessage.split(" ")
    for (i = 1; i < array.length; i++) {
        if (array[i] != "") {
            array[i] = array[i].toLowerCase()
            var char = array[i].split("")
            char[0] = char[0].toUpperCase()
            for (j = 0; j < char.length; j++) {
                msg = msg + char[j]
                //msg2 = msg2 + char[j]
                if (i != array.length - 1) {
                    if (j == char.length - 1) {
                        msg = msg + " "
                        //msg2 = msg2 + " "
                    }
                }
            }
        }
    }
    return msg
}
