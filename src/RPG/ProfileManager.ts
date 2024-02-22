import { QuickDB } from "quick.db";
import { Client } from "discord.js";

class ProfileStats {
    MAXHP: Number;
    HP: Number;
    Stamina: Number;
    Endurance: Number;
    PowerScale: Number;
    constructor(Stats: any) {
        this.MAXHP = Stats.MAXHP;
        this.HP = Stats.HP;
        this.Stamina = Stats.Stamina;
        this.Endurance = Stats.Endurance;
        this.PowerScale = Stats.PowerScale;
    }
}

type ItemsPropretyTyping = { [key: string]: Number };

class Inventory {
    Weapons: ItemsPropretyTyping;
    Potions: Array<string>;
    Items: ItemsPropretyTyping;
    Armors: ItemsPropretyTyping;
    constructor(Data: any) {
        for (const Weapon of Data.Weapons) {
            this.Weapons[Weapon.name] = Weapon.Durability;
        }
        for (const Potion of Data.Potions) {
            this.Potions.push(Potion);
        }
        for (const item of Data.Items) {
            this.Items[item.name] = item.amount;
        }
        for (const armor of Data.amors) {
            this.Armors[armor.name] = armor.Durability;
        }
    }
}

class Profile {
    Invalid: boolean;
    id: string;
    db: QuickDB;
    Lang: string;
    Money: Number;
    Souls: Number;
    EquipedWeapon: string;
    EquipedArmor: string;
    Stats: ProfileStats;
    Inventory: Inventory;
    constructor(Data: any, db: QuickDB, id: string) {
        this.id = id;
        this.db = db;
        this.Money = Data.Money;
        this.Souls = Data.Souls;
        this.Lang = Data.lang;
        this.EquipedWeapon = Data.equipedWeapon;
        this.EquipedArmor = Data.equipedArmor;
        this.Stats = new ProfileStats(Data.Stats);
        this.Inventory = new Inventory(Data.Inventory);
    }
}

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
        const Data = await this.Started(id, true);
        if (!Data) return;
        return new Profile(Data, this.db, id);
    }
    async GetLang(id: string): Promise<string> {
        const lang = await this.db.get(`RPG/${id}/lang`);
        if (!lang) return 'en';
        return lang;
    }
}