import { Client } from "discord.js";
import { QuickDB } from "quick.db";
import WeaponsManager from "./WeaponsManager.js";
import PotionsManager from "./PotionsManager.js";
import ProfileManager from "./ProfileManager.js";
import ItemManager from "./ItemManager.js";
import ShopManager from "./ShopManager.js";
import ArmorsManager from "./ArmorsManager.js";

export default class {
    client: Client;
    db: QuickDB;
    Weapons: WeaponsManager;
    Potions: PotionsManager;
    Profile: ProfileManager;
    Items: ItemManager;
    Shop: ShopManager;
    Armor: ArmorsManager;
    constructor(client: Client) {
        this.client = client;
        this.db = client.db;
        this.Weapons = new WeaponsManager();
        this.Potions = new PotionsManager();
        this.Items = new ItemManager();
        this.Profile = new ProfileManager(client);
        this.Shop = new ShopManager(this.Weapons, this.Potions, this.Profile);
    }
}