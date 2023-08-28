export enum Mods {
    NM = 'NM',
    HD = 'HD',
    HR = 'HR',
    DT = 'DT',
    FM = 'FM',
    EZ = 'EZ',
    FL = 'FL',
    HT = 'HT',
    TB = 'TB'
}

export const ModList: Mods[] = [Mods.NM, Mods.HD, Mods.HR, Mods.DT, Mods.FM, Mods.EZ, Mods.FL, Mods.HT, Mods.TB];

export const ModColors: { [key: string]: string } = {
    [Mods.NM]: '#3d85c6', //blue
    [Mods.HD]: '#bf9000', //yellow
    [Mods.HR]: '#cc0000', //red
    [Mods.DT]: '#9263d2', //purple
    [Mods.FM]: '#6aa84f', //green
    [Mods.EZ]: '#ff7700', //orange (Maybe swap with FM)
    [Mods.FL]: '#ffffff', //white
    [Mods.HT]: '#db00b3', //pink
    [Mods.TB]: '#aaaaaa' //gray
};

export const ModNames: { [key: string]: string } = {
    [Mods.NM]: 'No Mods',
    [Mods.HD]: 'Hidden',
    [Mods.HR]: 'Hard Rock',
    [Mods.DT]: 'Double Time',
    [Mods.FM]: 'Free Mods',
    [Mods.EZ]: 'Easy',
    [Mods.FL]: 'Flashlight',
    [Mods.HT]: 'Half Time',
    [Mods.TB]: 'Tiebreaker'
}