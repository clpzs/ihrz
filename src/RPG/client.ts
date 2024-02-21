import { Client } from "discord.js";
import { QuickDB } from "quick.db";
import WeaponsManager from "./WeaponsManager.js";

class ClientRPG {
    client: Client;
    db: QuickDB;
    Weapons: WeaponsManager;
    constructor(client: Client) {
        this.client = client;
        this.db = client.db;
        this.Weapons = new WeaponsManager();
    }
}

export default (client: Client) => {
    client.RPG = new ClientRPG(client);
}