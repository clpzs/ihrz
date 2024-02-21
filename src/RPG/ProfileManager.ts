import { QuickDB } from "quickdb";

class Profile {
   Money: Number;
   Souls: Number;
   HP: Number;
}

export default class {
    db: QuickDB
    constructor(client) {
        this.db = client.db;
    }
    Started(id: string) {
       
    }
    Get(id: string) {
       if (!Started(id)) return null;
       return new Profile(id);
    }
}