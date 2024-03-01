import fs from "node:fs";

function GetArmes(Dir: string) {
    let Data = {};
    for (const dircontent of fs.readdirSync(Dir)) {
        if (dircontent.isDirectory()) {
            Data = {...Data, ...GetArmes(`${Dir}/${dircontent}`)};
            continue;
        }
        const Arme = JSON.parse(fs.readFileSync(File));
        Data[Arme.en.name] = Arme;
    }
    return Data;
}

export default class {
    Data: any;
    constructor() {
        this.Data = GetArmes(`${process.cwd()}/RPG/Weapons`);
    }
    Get(name: string) {
        return this.Data[name];
    }
};