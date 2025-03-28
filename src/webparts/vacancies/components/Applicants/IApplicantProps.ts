import { IFileDataProps } from "../Vacancies/IVacancyProps";

export interface IApplicantProps{
    uniqueId: number;
    name: string;
    originalName: string;
    created: Date;
    formattedCreated: string;
    heldOnFile: boolean;
    status: string;
    appliedFor: IApplicantAppliedForProps[]; 
    editLink: string;
    telephoneNumber: string;
    email:string;
    files:  IApplicantFileProps[];
}

export interface IApplicantAppliedForProps {
    vacancyName: string
}

export interface IApplicantFileProps extends IFileDataProps{
    fileType: string;
}