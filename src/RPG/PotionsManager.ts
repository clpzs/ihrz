import fs from "node:fs";

function GetPotions(Dir: string) {
    let Data = {};
    for (const dircontent of fs.readdirSync(Dir)) {
        if (dircontent.isDirectory()) {
            Data = {...Data, ...GetPotions(`${Dir}/${dircontent}`)};
            continue;
        }
        const Potion = JSON.parse(fs.readFileSync(File));
        Data[Potion.en.name] = Potion;
    }
    return Data;
}

export default class {
    Data: any;
    constructor() {
        this.Data = GetPotions(`${process.cwd()}/RPG/Potions`);
    }
    Get(name: string) {
        return this.Data[name];
    }
}