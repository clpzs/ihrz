import { QuickDB } from "quick.db";
import { Client } from "discord.js";

class ProfileStats {
    MAXHP: Number;
    HP: Number;
    Stamina: Number;
    Endurance: Number;
    PowerScale: Number;
    Data: any;
    Changes: Array<string>;
    db: QuickDB;
    id: string;
    StData: any;
    constructor(Data: any, db: QuickDB, id: string) {
        const Stats = Data.Stats;
        this.StData = Stats;
        this.MAXHP = Stats.MAXHP;
        this.HP = Stats.HP;
        this.Stamina = Stats.Stamina;
        this.Endurance = Stats.Endurance;
        this.PowerScale = Stats.PowerScale;
        this.Data = Data;
        this.db = db;
        this.id = id;
    }
    async UpdateStats() {
        for (const change of this.Changes) {
            this.StData[change] = this[change as keyof this];
        }
        this.Data.Stats = this.StData;
        await this.db.set(`RPG/${this.id}`, this.Data);
    }
}

type ItemsPropretyTyping = { [key: string]: Number };

class Inventory {
    Weapons: ItemsPropretyTyping;
    Potions: Array<string>;
    Items: ItemsPropretyTyping;
    Armors: ItemsPropretyTyping;
    Data: any;
    db: QuickDB;
    id: string;
    constructor(Data: any, db: QuickDB, id: string) {
        this.id = id;
        this.db = db;
        const Items = Data.Inventory;
        for (const Weapon of Items.Weapons) {
            this.Weapons[Weapon.name] = Weapon.Durability;
        }
        for (const Potion of Items.Potions) {
            this.Potions.push(Potion);
        }
        for (const item of Items.Items) {
            this.Items[item.name] = item.amount;
        }
        for (const armor of Items.amors) {
            this.Armors[armor.name] = armor.Durability;
        }
        this.Data = Data;
    }
    async UpdateInventory() {
        [{name: "", Durability: 1}]
        let DBweapons = [];
        for (const Weapon of this.Weapons) {
            DBweapons.push({name: Weapon, Durability: this.Weapons[Weapon]});
        }
        let DBarmors = [];
        for (const Armor of this.Armors) {
            DBarmors.push({name: Armor, Durability: this.Armors[Armor]});
        }
        let DBitems = [];
        for (const Item of this.Items) {
            DBitems.push({"name": Item, "amount": this.Items[Item]});
        }
        this.Data.Inventory = {"Weapons": DBweapons, "armors": DBarmors, "Potions": this.Potions, "Items": DBitems}
        await this.db.set(`RPG/${this.id}`, this.Data);
    }
}

class Profile {
    Invalid: boolean;
    id: string;
    db: QuickDB;
    Lang: string;
    Money: Number;
    Souls: Array<string>;
    EquipedWeapon: string;
    EquipedArmor: string;
    Stats: ProfileStats;
    Inventory: Inventory;
    rawData: any;
    Changes: Array<string>;
    constructor(Data: any, db: QuickDB, id: string) {
        this.rawData = Data;
        this.id = id;
        this.db = db;
        this.Money = Data.Money;
        this.Souls = Data.Souls;
        this.Lang = Data.lang;
        this.EquipedWeapon = Data.equipedWeapon;
        this.EquipedArmor = Data.equipedArmor;
        this.Stats = new ProfileStats(Data, db, id);
        this.Inventory = new Inventory(Data, db, id);
    }
    async UpdateUser() {
        for (const change of this.Changes) {
            this.rawData[change] = this[change as keyof this];
        }
        await this.db.set(`RPG/${this.id}`, this.rawData);
    }
    async EquipWeapon(name: string): Promise<boolean> {
        if (!this.Inventory.Weapons[name]) return false;
        this.EquipedWeapon = name;
        this.Changes = ["EquipedWeapon"];
        await this.UpdateUser();
        return true;
    }
}

let OnProfiles = {};

export default class {
    db: QuickDB
    constructor(client: Client) {
        this.db = client.db;
    }
    async Started(id: string, ReturnLoadedData: boolean = false): Promise<any> {
        const Data = await this.db.get(`RPG/${id}`);
        if (!Data) return false;
        if (ReturnLoadedData) return Data;
        return true;
    }
    async Get(id: string): Promise<Profile | undefined> {
        let Data = OnProfiles[id];
        if (Data) return Data;
        Data = await this.Started(id, true);
        if (!Data) return;
        Data = new Profile(Data, this.db, id);
        OnProfiles[id] = Data;
        return Data;
    }
    async GetLang(id: string): Promise<string> {
        const lang = await this.db.get(`RPG/${id}/lang`);
        if (!lang) return 'en';
        return lang;
    }
}