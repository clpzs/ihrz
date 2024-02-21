import { QuickDB } from "quickdb";

class Profile {
    Money: Number;
    Souls: Number;
    HP: Number;
    constructor(id: string) {
        
    }
}

export default class {
    db: QuickDB
    constructor(client) {
        this.db = client.db;
    }
    Started(id: string): boolean {
        return false;
    }
    Get(id: string) {
        if (!this.Started(id)) return null;
        return new Profile(id);
    }
}