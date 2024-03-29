import chalk from "chalk";
import { Collection } from "discord.js";
import { Guilds } from "../Interfaces/Managers";
import Managers from "../Managers";
import {DataTypes} from "sequelize";

export default class Manager<Type> extends Collection<string, DatabaseManager<Type> & Type > {
    EagleManager: Managers;
    modelName: "antiraid" | "backup" | "blacklist" | "guilds" | "lastname" | "members" | "mute" | "owners" | "stats" | "tickets" | "whitelist";
    model: any;

    constructor(EagleManagers: Managers, modelName: "antiraid" | "backup" | "blacklist" | "guilds" | "lastname" | "members" | "mute" | "owners" | "stats" | "tickets" | "whitelist") {
        super();
        this.EagleManager = EagleManagers;
        this.modelName = modelName;
        this.init();
    }

    add(key: string, value: Type) {
        // @ts-ignore
        return this.set(key, new DatabaseManager<Type>(this, key, value)).get(key);
    }

    getIfExist(key: string) {
        return this.has(key) ? this.get(key) : null;
    }

    getAndCreateIfNotExists(key, values: Type) {
        return this.has(key) ? this.get(key) : this.add(key, values);
    }

    init() {
        require(`./${this.modelName}`).default(this.EagleManager.EagleClient?.database, this.modelName).then(data => {
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

    async loadTables(data: {model: string, key: Array<string>, add: string}) {
        for await (const element of (await this.EagleManager.EagleClient?.database.models[data.model].findAll()))
            this[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.get());
        this.EagleManager.actualModelLoad++;
        if (this.EagleManager.actualModelLoad >= (this.EagleManager.EagleClient?.database.modelManager.models.length || 1)) {
            this.EagleManager.actualModelLoad = 0
            this.EagleManager.EagleClient.startHandler();
        }
    }
}

export class DatabaseManager<T> {
    manager: Manager<T>;
    key: string;
    wheres: {};
    values: T;

    constructor(manager: Manager<T>, key: string, values_: T) {
        this.manager = manager;
        this.key = key;
        this.wheres = {};
        // @ts-ignore
        this.values = {};
        try {
            this.manager.model.filter(m => m.name !== "id").forEach(v => {
                switch (v.type.key) {
                    case DataTypes.JSON.key :
                        v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? (typeof values_[v.name] == "object" ? values_[v.name] : JSON.parse(values_[v.name])) : v.default : '';
                        break
                    case DataTypes.INTEGER.key :
                        v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? Number(values_[v.name]) : v.default : '';
                        break
                    default :
                        v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? values_[v.name] : v.default : '';
                }
                this[v.name] = this[v.isWhere ? "wheres" : "values"][v.name];
            });
        } catch (e) {console.log(e)}
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