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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const discord_js_1 = require("discord.js");
const sequelize_1 = require("sequelize");
class Manager extends discord_js_1.Collection {
    constructor(EagleManagers, modelName) {
        super();
        this.EagleManager = EagleManagers;
        this.modelName = modelName;
        this.init();
    }
    add(key, value) {
        // @ts-ignore
        return this.set(key, new DatabaseManager(this, key, value)).get(key);
    }
    getIfExist(key) {
        return this.has(key) ? this.get(key) : null;
    }
    getAndCreateIfNotExists(key, values) {
        return this.has(key) ? this.get(key) : this.add(key, values);
    }
    init() {
        var _a;
        require(`./${this.modelName}`).default((_a = this.EagleManager.EagleClient) === null || _a === void 0 ? void 0 : _a.database, this.modelName).then(data => {
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
    loadTables(data) {
        var _a, e_1, _b, _c;
        var _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var _f = true, _g = __asyncValues((yield ((_d = this.EagleManager.EagleClient) === null || _d === void 0 ? void 0 : _d.database.models[data.model].findAll()))), _h; _h = yield _g.next(), _a = _h.done, !_a;) {
                    _c = _h.value;
                    _f = false;
                    try {
                        const element = _c;
                        this[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.get());
                    }
                    finally {
                        _f = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = _g.return)) yield _b.call(_g);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.EagleManager.actualModelLoad++;
            if (this.EagleManager.actualModelLoad >= (((_e = this.EagleManager.EagleClient) === null || _e === void 0 ? void 0 : _e.database.modelManager.models.length) || 1)) {
                this.EagleManager.actualModelLoad = 0;
                this.EagleManager.EagleClient.startHandler();
            }
        });
    }
}
exports.default = Manager;
class DatabaseManager {
    constructor(manager, key, values_) {
        this.manager = manager;
        this.key = key;
        this.wheres = {};
        // @ts-ignore
        this.values = {};
        try {
            this.manager.model.filter(m => m.name !== "id").forEach(v => {
                switch (v.type.key) {
                    case sequelize_1.DataTypes.JSON.key:
                        v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? (typeof values_[v.name] == "object" ? values_[v.name] : JSON.parse(values_[v.name])) : v.default : '';
                        break;
                    case sequelize_1.DataTypes.INTEGER.key:
                        v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? Number(values_[v.name]) : v.default : '';
                        break;
                    default:
                        v.isWhere || v.isValue ? (v.isWhere ? this.wheres : this.values)[v.name] = values_[v.name] || !v.default ? values_[v.name] : v.default : '';
                }
                this[v.name] = this[v.isWhere ? "wheres" : "values"][v.name];
            });
        }
        catch (e) {
            console.log(e);
        }
        this.values = Object.assign(Object.assign({}, this.wheres), this.values);
    }
    set(key, value) {
        this[key] = value;
        return this;
    }
    delete() {
        this.manager.EagleManager.EagleClient.database.models[this.manager.modelName].destroy({
            where: this.wheres
        }).then(() => this.manager.delete(this.key)).catch(() => { });
        return this;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            Object.keys(this.values).forEach(k => this.values[k] = this[k]);
            this.updateOrCreate(this.manager.EagleManager.EagleClient.database.models[this.manager.modelName], this.wheres, this.values).then(() => { }).catch((err) => console.error("error saving", err));
            return this;
        });
    }
    updateOrCreate(model, where, newItem) {
        return new Promise((resolve, reject) => {
            model.findOne({ where }).then(foundItem => {
                if (!foundItem)
                    model.create(newItem).then(item => resolve({ item, created: true })).catch(e => reject(e));
                else
                    model.update(newItem, { where }).then(item => resolve({ item, created: false })).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }
}
exports.DatabaseManager = DatabaseManager;
