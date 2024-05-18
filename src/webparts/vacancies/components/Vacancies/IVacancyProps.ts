export interface INotifyProps{
    name: string;
    email: string;
}

export interface IVacancyProps{
    uniqueId: number;
    name:string;
    closingDate: string;
    itemCount: number;
    accessibleTo?: INotifyProps[];
}