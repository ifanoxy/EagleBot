const { Client, Partials, Collection, SnowflakeUtil } = require("discord.js");
const { EagleHandler } = require("./Handler/EagleHandler");
const { EagleDatabaseSqlite } = require("./DataBase");
const { EagleManagers } = require("./Manager");
const { Moderation } = require("./Moderation");
const chalk = require("chalk");
const { AntiRaidClient } = require("./AntiRaidClient");
const { EagleFonctions } = require("./Fonctions");
const { AntiCrash } = require("./Handler/AntiCrash");

class EagleClient extends Client {
    constructor() {
        super({
            closeTimeout: 7 * 1000,
            intents: 3276799,
            partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
        })
        console.log(`                                                                            
                               ::                                                                   
                               ?PJ~:.                                                               
                               ~BBBG5?~:.                                                           
                                7GBBBBBGPY?!^..      .........                                      
                             ?!. ^YBBBBBBBBBBP5J!^:.     ..:^~~~~:.                                 
                            .PB5!:.^?PBBBBBBBBBBBBG5J!^.       .^!??7^.                             
                             7BBBGY?!!?YGBBBBBBBBBBBBBBPY?~:       :!JYJ!:                          
                             .7GBBBBBBBBBBBBBBBBBBBBBBBBBBBGY7^.!^.   :75PJ~.                       
                               ^JGBBBBBBBBBBBBBBBBBBBBBBBBBBBBB5GBY~.   .!5BP7:                     
                            :^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY:    .!PBP?:                   
                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJ7J5GBBBBBBP^     :JBBP7.                 
                     .^75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY~.:~?5GBBB5.     .7GBB5^                
                   .!YGBBBBBBBBBBBBBBGGGBBBBBBBBBBBBBBBBBBBBB5?~^:^7YPP:       ~GBBG7.              
                 .!5BBBBBBBBBBBBG5J?J5GBBBBBBBBBBBBBBBBBBBBBBBBBGGPYJ7~:        ~GBBBJ.             
                ~5BBBBBBBBBBBGJ!^7YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ!:      7BBBBY.            
              :JBBBBBBBBBBBP7::7PBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?^    .YBBBBJ.           
             ^5BBBBBBBBBBG7..!PBBBBBBBBBBBBBBBBBBBBGGP555555PPGGBBBBBBBBBBBBG7.   ~BBBBB7           
            ~PBBBBBBBBBBY: .JBBBBBBBBBBBBBBBBBGY?!^:..... ....::^~7?YPGBBBBBBB?   .PBBBBG^          
           ^GBBBBBBBBBBJ. .YBBBBBBBBBBBBBBBGJ~:                      .:!?5BBBBP.   JBBBBBY          
          :5BBBBBBBBBBJ. .JBBBBBBBBBBBBBBGJ:                             .^JGBY    ?BBBBBG^         
          ?BBBBBBBBBB5.  ~BBBBBBBBBBBBBBP~                                  ~J:    ?BBBBBB7         
         :GBBBBBBBBBB~  .YBBBBBBBBBBBBBP^                                          YBBBBBBJ         
         !BBBBBBBBBBP.  :GBBBBBBBBBBBBB!                                          .PBBBBBBY         
         JBBBBBBBBBBY   ^BBBBBBBBBBBBB5.                                          !BBBBBBBY         
         YBBBBBBBBBBJ   :GBBBBBBBBBBBB?                                          .5BBBBBBB?         
         YBBBBBBBBBBY   .PBBBBBBBBBBBB!                                          ?BBBBBBBB~         
         ?BBBBBBBBBBP:   7BBBP5BBBBBBB!                                         7BBBBBBBBP:         
         ~BBBBBBBBBBB!   :PBB?~BBBBBBB?                                       .7BBBBBBBBB?          
         .5BBBBBBBBBBP:   ^GB~ ?BBBBBBY.                                     .JBBBBBBBBB5.          
          !BBBBBBBBBBB5:   ~5: .JBBBBBG^                                    ~5BBBBBBBBBG~           
          .JBBBBBBBBBBB5:   :.  .?GBBBBJ                                  :JGBBBBBBBBBG!            
           :5BBBBBBBBBBBP!.       ~5BBBG^                               :?GBBBBBBBBBBG!             
            :5BBBBBBBBBBBBY~.      .7PBB5.                           .~JGBBBBBBBBBBBP~              
             :YBBBBBBBBBBBBBY!:      .!5GJ.                       .^?PBBBBBBBBBBBBBY^               
              .7GBBBBBBBBBBBBBPJ!:.    .:!:                   .^!JPBBBBBBBBBBBBBBG7.                
                ^YBBBBBBBBBBBBBBBG5J7~^:..             ..:~!?YPBBBBBBBBBBBBBBBBGJ:                  
                 .~YBBBBBBBBBBBBBBBBBBGGP5YJJ??????JJY5PGGBBBBBBBBBBBBBBBBBBBGJ^                    
                   .~YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?:                      
                      :75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ~.                        ` + chalk.red("Version { Pre-Alpha }") +`
                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBG5?~.                           ` + chalk.green("Last update: 31/01/2023") + `
                            :^7J5GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBGPY?~:.                              
                                .:^!7JY5PGGBBBBBBBBBBBGGGP5Y?7~:.                                   ` + chalk.bold.yellow("full developed by Ifanoxy#7183") + `
                                       ..::^^^~~~~~~^^^::..                                                                                            
`+ chalk.blue(`
     _______      ___        _______   __       _______     ______     ______    ___________ 
    |   ____|    /   \\      /  _____| |  |     |   ____|   |   _  \\   /  __  \\  |           |
    |  |__      /  ^  \\    |  |  __   |  |     |  |__      |  |_)  | |  |  |  | |---|  |----|
    |   __|    /  /_\\  \\   |  | |_ |  |  |     |   __|     |   _  <  |  |  |  |     |  |     
    |  |____  /  _____  \\  |  |__| |  |  |----.|  |____    |  |_)  | |  '--'  |     |  |     
    |_______|/__/     \\__\\  \\______|  |_______||_______|   |______/   \\______/      |__|                                                                        
`))
        
        this.Collection = Collection;
        this._fs = require("fs");
        this.config = require('../config');
        this.database = new EagleDatabaseSqlite(this);
        this.database.auth().then(() => {
            console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.blueBright("Database connection..."))
            this.managers = new EagleManagers(this);
        });
        this.fonctions = new EagleFonctions(this);
        this.moderation = new Moderation(this);
        this.on("ready", () => console.log(chalk.bold.greenBright("\n[Eagle BOT]") + chalk.blueBright(`Bot is ready ! Connected on ${this.user.tag}\n`)))     
    }

    startHandler() {
        this.handlers = new EagleHandler(this);
        this.login(this.config.discord.token)
        .then(() => {
            console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.yellow(`Adding ${this.handlers.slashCommandsHandler.SlashCommandsList.size} slash commands`))
            this.application.commands.set(this.handlers.slashCommandsHandler.SlashCommandsList.map(s => s.data.toJSON()))
            
            this.antiraidClient = new AntiRaidClient();
        })
    }

    checkSnowflake(string = String) {
        if (!(17 <= string.length <= 22)) return 0
        try {
            SnowflakeUtil.decode(string)
        } catch {
            return 0
        }
        return 1
    }

    error(err) {
        console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(" an error has occurred :\n" + err))
    }
}

module.exports = { EagleClient }