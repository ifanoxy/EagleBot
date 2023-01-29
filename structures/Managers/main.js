const { Collection } = require('discord.js');
const chalk = require("chalk");

class Manager extends Collection {

    constructor(EagleManagers, modelName) {
        super();
        this.EagleManager = EagleManagers;
        this.modelName = modelName;
        this.init();
    }

    add(key, value = {}) {
        return this.set(key, new DatabaseManager(this, value, key)).get(key);
    }

    getIfExist(key) {
        return this.has(key) ? this.get(key) : null;
    }

    getAndCreateIfNotExists(key, values = {}) {
        return this.has(key) ? this.get(key) : this.add(key, values);
    }

    init() {
        require(`./${this.modelName}`)(this.EagleManager.EagleClient.database, this.modelName, this.EagleManager.EagleClient.config).then(data => {
            this.model = data;
            this.loadTable();
        });
        return this;
    }

    loadTable() {
        const key = [];
        this.model.filter(m => m.name !== "id" && m.isWhere).forEach(m => key.push(`{${m.name}}`, "-"));
        this.loadTables({
            model: this.modelName,
            key: key.slice(0, -1),
            add: 'add'
        });
    }

    async loadTables(data = {}) {
        for await (const element of (await this.EagleManager.EagleClient.database.models[data.model].findAll()))
            this[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.get());
        console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.redBright(`Database - Successfully loaded ${this.size} ${data.model.charAt(0).toUpperCase()}${data.model.slice(1)}`))
        this.EagleManager.actualModelLoad++;
        if (this.EagleManager.actualModelLoad >= this.EagleManager.EagleClient.database.modelManager.models.length) {
            this.EagleManager.actualModelLoad = 0
            this.EagleManager.EagleClient.startHandler();
        }
    }
}

class DatabaseManager {
    constructor(manager, values_ = {}, key) {
        this.manager = manager;

        this.key = key;

        this.wheres = {};
        this.values = {};
        this.manager.model.filter(m => m.name !== "id").forEach(v => {
            v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? values_[v.name] : v.default : '';
            this[v.name] = this[v.isWhere ? "wheres" : "values"][v.name];
        });
        this.values = {...this.wheres, ...this.values};
    }

    set(key, value) {
        this[key] = value;
        return this;
    }

    delete() {
        this.manager.EagleManager.EagleClient.database.models[this.manager.modelName].destroy({
            where: this.wheres
        }).then(() => this.manager.delete(this.key)).catch(() => {})
        return this;
    }

    async save() {
        Object.keys(this.values).forEach(k => this.values[k] = this[k]);
        this.updateOrCreate(this.manager.EagleManager.EagleClient.database.models[this.manager.modelName], this.wheres, this.values).then(() => {}).catch((err) => console.error("error saving", err));
        return this;
    }

    updateOrCreate(model, where, newItem) {
        return new Promise((resolve, reject) => {
            model.findOne({ where }).then(foundItem => {
                if (!foundItem)
                    model.create(newItem).then(item => resolve({ item, created: true })).catch(e => reject(e))
                else
                    model.update(newItem, { where }).then(item => resolve({ item, created: false })).catch(e => reject(e))
            }).catch(e => reject(e))
        })
    }
}

module.exports = { Manager }