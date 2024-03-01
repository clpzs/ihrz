import fs from "node:fs";

function GetArmors(Dir: string) {
    let Data = {};
    for (const dircontent of fs.readdirSync(Dir)) {
        if (dircontent.isDirectory()) {
            Data = {...Data, ...GetArmors(`${Dir}/${dircontent}`)};
            continue;
        }
        const Armor = JSON.parse(fs.readFileSync(File));
        Data[Armor.en.name] = Armor;
    }
    return Data;
}

export default class {
    Data: any;
    constructor() {
        this.Data = GetArmors(`${process.cwd()}/RPG/Armors`);
    }
    Get(name: string) {
        return this.Data[name];
    }
};