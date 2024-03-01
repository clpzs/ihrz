import fs from "node:fs";

function GetItems(Dir: string) {
    let Data = {};
    for (const dircontent of fs.readdirSync(Dir)) {
        if (dircontent.isDirectory()) {
            Data = {...Data, ...GetItems(`${Dir}/${dircontent}`)};
            continue;
        }
        const item = JSON.parse(fs.readFileSync(File));
        Data[item.en.name] = item;
    }
    return Data;
}

export default class {
    Data: any;
    constructor() {
        this.Data = GetItems(`${process.cwd()}/RPG/Items`);
    }
    Get(name: string) {
        return this.Data[name];
    }
}