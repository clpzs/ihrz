import { QuickDB } from 'quick.db';
import { Client } from 'discord.js';
export default class {
    db: QuickDB;
    client: Client;
    constructor(client: Client) {
        this.db = client.db;
        this.client = client;
    }
    async buy(ItemName: string,  buyerId: string, type: string = "Item"): Promise<Number> {
        /* 
        200: okay
        404: Item not found
        401: User not found
        222: Not enough money to buy
        223: Not enough souls to buy

        */
        let item;
        const lowtype = type.toLowerCase();
        const user = await this.client.Profile.Get(buyerId);
        if (!user) return 401;
        switch(lowtype) {
            case 'weapon':
                item = await this.client.Weapons.Get(ItemName);
                if (!item) return 404;
                user.Inventory.Weapons[item.en.name] = item.Stats.Durability;
            case 'potion':
                item = await this.client.Potions.Get(ItemName);
                if (!item) return 404;
                user.Inventory.Weapons[item.en.name] = item.Stats.amount;
            case 'armor':
                item = await this.client.Armors.Get(ItemName);
                if (!item) return 404;
                user.Inventory.Weapons[item.en.name] = item.Stats.Durability;
            default:
                item = await this.client.Items.Get(ItemName);
                if (!item) return 404;
                user.Inventory.Weapons[item.en.name] = item.Stats.amount;
        }
        switch(item.Stats.Currency) {
            case 'money':
                if (item.Stats.price > user.Money) {
                    return 222;
                }
                user.Money -= item.Stats.price;
                user.Changes.push('Money');
            case "souls":
                if (item.Stats.price > user.Souls) {
                    return 223;
                }
                const oldsouls = user.Souls.splice(0, 10);
                user.Changes.push('Souls');
                user.PowerScaleCalculate();
                for (const soulid of oldsouls) {
                    const soul = await this.client.Profile.Get(soulid);
                    soul.SoulOwner = "";
                    soul.Changes.push('SoulOwner');
                    await soul.UpdateUser();
                }
            }
        user.Inventory.UpdateInventory();
        user.UpdateUser();
        return 200;
    }
}