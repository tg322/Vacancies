export interface INotifyProps{
    name: string;
    email: string;
}

export interface IFileDataProps{
    name: string;
    serverRelativeUrl: string;
    timeCreated: string;
}

export interface IVacancyProps{
    uniqueId: number;
    name:string;
    originalName:string;
    created: Date;
    closingDate: Date;
    formattedCreated: string;
    formattedClosingDate: string;
    itemCount: number;
    vacancyEditLink: string;
    archived:boolean;
    vacancyPack?: IFileDataProps;
    fileData?: IFileDataProps[];
    accessibleTo?: INotifyProps[];
}