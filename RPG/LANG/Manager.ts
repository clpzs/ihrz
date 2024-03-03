import { fs } from 'node:fs';
import { yaml } from "js-yaml";
import { LanguageData } from '../../types/languageData.js';
import { Client } from "discord.js";

interface LoadedUsersType {
    [lang: string]: string;
}
interface LangDataType {
    [lang: string]: LanguageData;
}

let LoadedUsers: LoadedUsersType = {};
let LoadedLangData: LangDataType = {};

export default function(UserId: string, client: Client) {
    let lang: string = LoadedUsers[UserId];
    if (!lang) {
        lang = client.RPG.ProfileManager.GetLang(UserId);
        if (!lang) { 
            lang = 'en';
        }
        LoadedUsers[UserId] = lang;
    }
    let data = LoadedLangData[lang];
    if (!data) {
        data = yaml.load(fs.readFileSync(`${process.cwd()}/RPG/LANG/${lang}.yml`, 'utf8')) as LanguageData;
        LoadedLangData[lang] = data;
    }
    return data;
}