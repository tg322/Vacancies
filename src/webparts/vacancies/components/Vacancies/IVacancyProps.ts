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
    closingDate: string;
    itemCount: number;
    fileData?: IFileDataProps;
    accessibleTo?: INotifyProps[];
}