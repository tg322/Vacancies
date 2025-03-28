import { IApplicantAppliedForProps, IApplicantFileProps, IApplicantProps } from "../components/Applicants/IApplicantProps";
import { IFileDataProps, INotifyProps, IVacancyProps } from "../components/Vacancies/IVacancyProps";
import { BuildResponseType, DataHandler } from "./Helpers";

export class Vacancy implements IVacancyProps{
    constructor (
        public uniqueId: number,
        public name: string,
        public originalName: string,
        public created: Date,
        public closingDate: Date,
        public formattedCreated: string,
        public formattedClosingDate: string,
        public itemCount: number,
        public vacancyEditLink: string,
        public archived: boolean,
        public status:string,
        public vacancyPack?: IFileDataProps,
        public fileData?: IFileDataProps[],
        public accessibleTo?: INotifyProps[],
    ) { }
  }

export class NotifyUsers implements INotifyProps{
    constructor (
        public name: string,
        public email: string
    ) { }
}

export class AppliedFor implements IApplicantAppliedForProps{
    constructor (
        public vacancyName: string
    ) { }
}

export class FileData implements IFileDataProps{
    constructor (
        public name: string,
        public serverRelativeUrl: string,
        public timeCreated: string
    ) { }
}

export class Applicant implements IApplicantProps{
    constructor (
        public uniqueId: number,
        public name: string,
        public originalName: string,
        public created: Date,
        public formattedCreated: string,
        public heldOnFile: boolean,
        public status: string,
        public appliedFor: IApplicantAppliedForProps[],
        public editLink: string,
        public telephoneNumber: string,
        public email:string,
        public files: IApplicantFileProps[]
    ) { }
  }

  export class ApplicantFileData implements IApplicantFileProps{
    constructor (
        public name: string,
        public fileType: string,
        public serverRelativeUrl: string,
        public timeCreated: string
    ) { }
}




export class PreparedData {

    public dataHandler = new DataHandler();

    async getVacancies(context: any): Promise<BuildResponseType>{

        try {
            const vacanciesResponse = await this.dataHandler.getFoldersFromSP(context, '/sites/Staff/Recruitment/Applications/Vacancies');

            if (!vacanciesResponse.success) {
                throw new Error('Failed to fetch vacancies: ' + JSON.stringify(vacanciesResponse));
            }

            let vacancies = vacanciesResponse.data.value.filter((item: any) => item.ListItemAllFields.Archive === false || item.ListItemAllFields.Archive === null);

            //two checks required, was anything even returned, is the length more than 0
            if(vacancies.length === 0){
                return this.dataHandler.buildResponse(true, 'Vacancies fetched successfully.', vacancies);
            }

            const preparedVacanciesResponse = await this.prepareVacancies(context, vacancies);

            return preparedVacanciesResponse

        }catch(error){
            return this.dataHandler.buildResponse(false, 'An error occurred fetching vacancies.', '', error);
        }

    }

    async getArchivedVacancies(context: any): Promise<BuildResponseType>{

        try {
            const vacanciesResponse = await this.dataHandler.getFoldersFromSP(context, '/sites/Staff/Recruitment/Applications/Vacancies');

            if (!vacanciesResponse.success) {
                throw new Error('Failed to fetch vacancies: ' + JSON.stringify(vacanciesResponse));
            }

            let archivedVacancies = vacanciesResponse.data.value.filter((item: any) => item.ListItemAllFields.Archive === true);

            if(archivedVacancies.length === 0){
                return this.dataHandler.buildResponse(true, 'Archived Vacancies fetched successfully.', archivedVacancies);
            }

            const preparedVacanciesResponse = await this.prepareVacancies(context, archivedVacancies);

            return preparedVacanciesResponse

        }catch(error){
            return this.dataHandler.buildResponse(false, 'An error occurred fetching vacancies.', '', error);
        }

    }

    async prepareVacancies(context: any, vacancyData:any): Promise<BuildResponseType> {

        let preparedVacancies: IVacancyProps[] = [];

            for (const key of Object.keys(vacancyData)) {
                const singleVacancy = vacancyData[Number(key)];

                let notify = undefined;
                let itemCount = singleVacancy.ItemCount;

                if (singleVacancy.ListItemAllFields.NotifyId != null) {

                    const notifyUsersResponse = await this.buildVacancyNotify(singleVacancy, context);

                    if(!notifyUsersResponse.success){
                        return notifyUsersResponse
                    }

                    notify = [];

                    notify.push(notifyUsersResponse.data);
                    
                }
                const folderEditLink = singleVacancy['@odata.editLink'];

                console.log(folderEditLink);

                const vacancyFileDataResponse = await this.buildVacancyFiles(folderEditLink, context);

                if(!vacancyFileDataResponse.success){
                    return vacancyFileDataResponse
                }

                const vacancyFiles = vacancyFileDataResponse.data;

                itemCount = itemCount -vacancyFiles.length;

                const createdDateObject = new Date(singleVacancy.ListItemAllFields.Created);
                const formattedCreatedDateObject = this.formatDate(createdDateObject);

                const dateClosingObject = new Date(singleVacancy.ListItemAllFields.ClosingDate);
                const formattedClosingDateObject = this.formatDate(dateClosingObject);

                let archived = singleVacancy.ListItemAllFields.Archive;
                if(archived === null){
                    archived = false;
                }

                const vacancyStatus = this.determineStatus(dateClosingObject);

                preparedVacancies.push(new Vacancy(
                    singleVacancy.UniqueId,
                    singleVacancy.Name.slice(0, singleVacancy.Name.indexOf('-')),
                    singleVacancy.Name, 
                    createdDateObject, 
                    dateClosingObject,
                    formattedCreatedDateObject, 
                    formattedClosingDateObject,
                    itemCount,
                    folderEditLink,
                    archived,
                    vacancyStatus,
                    undefined,
                    vacancyFiles,
                    notify
                ));
            }

        return this.dataHandler.buildResponse(true, 'Vacancies prepared successfully', preparedVacancies);
    }

    async addFileToVacancy(context: any, file:FileList | File, vacancyName:string):Promise<BuildResponseType>{

        let response = []

        if(file instanceof FileList){
            for (const key of Object.keys(file)) {
                const singleFile = file[Number(key)];
                let result = await this.dataHandler.uploadFileToSP(context, `${context.pageContext.web.absoluteUrl}`, singleFile, `Applications/Vacancies/${vacancyName}`, true, singleFile.name );

                response.push(result.data);
            }
            return this.dataHandler.buildResponse(true, 'Vacancy Files Added.', response);
        }else{
            let result = await this.dataHandler.uploadFileToSP(context, `${context.pageContext.web.absoluteUrl}`, file, `Applications/Vacancies/${vacancyName}`, true, file.name );

            response.push(result.data);

            return this.dataHandler.buildResponse(true, 'Vacancy Files Added.', response);
            
        }
        
    }

    public formatDate(dateObject: Date) {
        const yyyy = dateObject.getFullYear();
        let mm = dateObject.getMonth() + 1; // Months start at 0!
        let dd = dateObject.getDate();

        if (dd < 10) dd = 0 + dd;
        if (mm < 10) mm = 0 + mm;

        return `${dd}/${mm}/${yyyy}`;
    }

    public async buildVacancyNotify(singleVacancy:any, context:any): Promise<BuildResponseType>{

        if (singleVacancy.ListItemAllFields.NotifyId != null) {
            try {
                const userDetailsResponse = await this.dataHandler.getUserBySpId(context, singleVacancy.ListItemAllFields.NotifyId);

                if (!userDetailsResponse.success) {
                    return userDetailsResponse;
                }

                const response = new NotifyUsers(userDetailsResponse.data.Title, userDetailsResponse.data.Email);

                return this.dataHandler.buildResponse(true, 'Notify users added successfully.', response);

            } catch (error) {
                console.log(error);
                return this.dataHandler.buildResponse(false, 'Failed to get Notify Users.','', error);
            }
        }

        return this.dataHandler.buildResponse(true, 'Notify users added successfully.', undefined);

    }

    public async buildVacancyFiles(singleVacancyEditLink:string, context:any):Promise<BuildResponseType>{

        let vacancyFilesData:IFileDataProps[]= [];

        try {
            
            const pdfFileResponse = await this.dataHandler.getFilesFromFolder(context, singleVacancyEditLink);

            if (!pdfFileResponse.success) {
                return pdfFileResponse;
            }

            if (pdfFileResponse.data.value.length > 0) {
                
                //item count should only be total applicants, so because pdf files were found, this is also accounted for in the total item count so remove .length from the item count to take away the pdf file.
                for (const key of Object.keys(pdfFileResponse.data.value)) {
                    const singleFile = pdfFileResponse.data.value[Number(key)];
                    vacancyFilesData.push(new FileData(singleFile.Name, singleFile.ServerRelativeUrl, singleFile.TimeCreated));
                }
            }

        } catch (error) {
            return this.dataHandler.buildResponse(false, 'Vacancy Files Failed', '', error);
        }

        return this.dataHandler.buildResponse(true, 'Vacancy Files Added.', vacancyFilesData);

    }

    private determineStatus(closingDate: Date){
        const today = new Date();

        const twoWeeksBeforeClosing = new Date(closingDate.getTime() - 14);

        if (today >= twoWeeksBeforeClosing && today < closingDate) {
            return 'closing soon';
        } else if (today >= closingDate) {
            return 'closed';
        } else {
            return 'open';
        }


    }

    async getAllApplicants(context:any): Promise<BuildResponseType>{
        let preparedApplicants: IApplicantProps[] = [];

        try{

            const applicantsResponse = await this.dataHandler.getFoldersFromSP(context, `/sites/Staff/Recruitment/Applications/Applicants`);

            if(!applicantsResponse.success){
                return applicantsResponse
            }

            

            const applicants = applicantsResponse.data.value.filter((applicant: any) => applicant.ListItemAllFields.HeldonFile !== true);

            for (const key of Object.keys(applicants)) {
                const singleApplicant = applicants[Number(key)];

                console.log('single applicant',singleApplicant.ListItemAllFields);

                const folderEditLink = singleApplicant['@odata.editLink'];

                const applicantFileDataResponse = await this.buildApplicantFiles(folderEditLink, context);

                if(!applicantFileDataResponse.success){
                    return applicantFileDataResponse
                }

                const createdDateObject = new Date(singleApplicant.ListItemAllFields.Created);
                const formattedCreatedDateObject = this.formatDate(createdDateObject);

                let preparedAppliedFor:IApplicantAppliedForProps[] = [];

                if(singleApplicant.ListItemAllFields.AppliedFor != null){
                    let appliedFor = singleApplicant.ListItemAllFields.AppliedFor

                    for (const key of Object.keys(appliedFor)) {
                        const singleAppliedFor = appliedFor[Number(key)];
                        preparedAppliedFor.push( new AppliedFor(singleAppliedFor));

                    }
                }

                preparedApplicants.push(new Applicant(
                    singleApplicant.UniqueId,
                    singleApplicant.Name.slice(0, singleApplicant.Name.indexOf('-')),
                    singleApplicant.Name,
                    createdDateObject,
                    formattedCreatedDateObject,
                    false,
                    singleApplicant.ListItemAllFields.Status,
                    preparedAppliedFor,
                    folderEditLink,
                    singleApplicant.ListItemAllFields.TelephoneNumber,
                    singleApplicant.ListItemAllFields.Email,
                    applicantFileDataResponse.data
                ));
            }

        }catch(error){
            return this.dataHandler.buildResponse(false, 'Applicants Failed', '', error);
        }

        return this.dataHandler.buildResponse(true, 'Applicants retrieved successfully.', preparedApplicants);

    }

    async getVacancyApplicants(context:any, vacancyFullName: string): Promise<BuildResponseType>{
        let preparedApplicants: IApplicantProps[] = [];

        try{

            const applicantsResponse = await this.dataHandler.getFoldersFromSPUpdated(context, `/sites/Staff/Recruitment/Applications/Applicants`, {
                filter: `Name ne 'Forms'`,
                expand: 'ListItemAllFields',
                select: 'Name,UniqueId,ItemCount,ListItemAllFields/AppliedFor,ListItemAllFields/HeldonFile,ListItemAllFields/Status,ListItemAllFields/TelephoneNumber,ListItemAllFields/Email'
            });

            if(!applicantsResponse.success){
                return applicantsResponse
            }

            const applicants = applicantsResponse.data.value.filter((applicant: any) => applicant.ListItemAllFields.AppliedFor && 
            applicant.ListItemAllFields.AppliedFor.includes(vacancyFullName) && applicant.ListItemAllFields.HeldonFile !== true
            );

            for (const key of Object.keys(applicants)) {
                const singleApplicant = applicants[Number(key)];

                let preparedAppliedFor:IApplicantAppliedForProps[] = [];

                if(singleApplicant.ListItemAllFields.AppliedFor != null){
                    let appliedFor = singleApplicant.ListItemAllFields.AppliedFor

                    for (const key of Object.keys(appliedFor)) {
                        const singleAppliedFor = appliedFor[Number(key)];
                        preparedAppliedFor.push( new AppliedFor(singleAppliedFor));

                    }
                }

                console.log('single applicant',singleApplicant);

                const folderEditLink = singleApplicant['@odata.editLink'];

                const applicantFileDataResponse = await this.buildApplicantFiles(folderEditLink, context);

                if(!applicantFileDataResponse.success){
                    return applicantFileDataResponse
                }

                const createdDateObject = new Date(singleApplicant.ListItemAllFields.Created);
                const formattedCreatedDateObject = this.formatDate(createdDateObject);

                preparedApplicants.push(new Applicant(
                    singleApplicant.UniqueId,
                    singleApplicant.Name.slice(0, singleApplicant.Name.indexOf('-')),
                    singleApplicant.Name,
                    createdDateObject,
                    formattedCreatedDateObject,
                    false,
                    singleApplicant.ListItemAllFields.Status,
                    preparedAppliedFor,
                    folderEditLink,
                    singleApplicant.ListItemAllFields.TelephoneNumber,
                    singleApplicant.ListItemAllFields.Email,
                    applicantFileDataResponse.data
                ));
            }

        }catch(error){
            return this.dataHandler.buildResponse(false, 'Applicants Failed', '', error);
        }

        return this.dataHandler.buildResponse(true, 'Applicants retrieved successfully.', preparedApplicants);

    }

    async getHeldOnFileApplicants(context:any): Promise<BuildResponseType>{
        let preparedApplicants: IApplicantProps[] = [];

        try{

            const applicantsResponse = await this.dataHandler.getFoldersFromSPUpdated(context, `/sites/Staff/Recruitment/Applications/Applicants`, {
                filter: `Name ne 'Forms'`,
                expand: 'ListItemAllFields',
                select: 'Name,UniqueId,ItemCount,ListItemAllFields/AppliedFor,ListItemAllFields/HeldonFile,ListItemAllFields/TelephoneNumber,ListItemAllFields/Email'
            });

            if(!applicantsResponse.success){
                return applicantsResponse
            }

            const applicants = applicantsResponse.data.value.filter((applicant: any) => applicant.ListItemAllFields.HeldonFile === true);

            for (const key of Object.keys(applicants)) {
                const singleApplicant = applicants[Number(key)];

                let preparedAppliedFor:IApplicantAppliedForProps[] = [];

                if(singleApplicant.ListItemAllFields.AppliedFor != null){
                    let appliedFor = singleApplicant.ListItemAllFields.AppliedFor

                    for (const key of Object.keys(appliedFor)) {
                        const singleAppliedFor = appliedFor[Number(key)];
                        preparedAppliedFor.push( new AppliedFor(singleAppliedFor));

                    }
                }

                console.log('single applicant',singleApplicant);

                const folderEditLink = singleApplicant['@odata.editLink'];

                const applicantFileDataResponse = await this.buildApplicantFiles(folderEditLink, context);

                if(!applicantFileDataResponse.success){
                    return applicantFileDataResponse
                }

                const createdDateObject = new Date(singleApplicant.ListItemAllFields.Created);
                const formattedCreatedDateObject = this.formatDate(createdDateObject);

                preparedApplicants.push(new Applicant(
                    singleApplicant.UniqueId,
                    singleApplicant.Name.slice(0, singleApplicant.Name.indexOf('-')),
                    singleApplicant.Name,
                    createdDateObject,
                    formattedCreatedDateObject,
                    false,
                    singleApplicant.ListItemAllFields.Status,
                    preparedAppliedFor,
                    folderEditLink,
                    singleApplicant.ListItemAllFields.TelephoneNumber,
                    singleApplicant.ListItemAllFields.Email,
                    applicantFileDataResponse.data
                ));
            }

        }catch(error){
            return this.dataHandler.buildResponse(false, 'Applicants Failed', '', error);
        }

        return this.dataHandler.buildResponse(true, 'Applicants retrieved successfully.', preparedApplicants);

    }

    public async buildApplicantFiles(editLink:string, context:any):Promise<BuildResponseType>{

        let applicantFilesData:IFileDataProps[]= [];

        try {
            
            const pdfFileResponse = await this.dataHandler.getFilesFromFolder(context, editLink);

            if (!pdfFileResponse.success) {
                return pdfFileResponse;
            }

            console.log(pdfFileResponse);

            

            if (pdfFileResponse.data.value.length > 0) {
                for (const key of Object.keys(pdfFileResponse.data.value)) {
                    const singleFile = pdfFileResponse.data.value[Number(key)];

                    let fileType = singleFile.ListItemAllFields.FileType;
                    if(fileType === null){
                        fileType = 'Not Assigned';
                    }

                    applicantFilesData.push(new ApplicantFileData(singleFile.Name, fileType, singleFile.ServerRelativeUrl, singleFile.TimeCreated));
                }
            }

        } catch (error) {
            return this.dataHandler.buildResponse(false, 'Applicant Files Failed', '', error);
        }

        return this.dataHandler.buildResponse(true, 'Applicant Files Added.', applicantFilesData);

    }

}