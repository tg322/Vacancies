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

export class FileData implements IFileDataProps{
    constructor (
        public name: string,
        public serverRelativeUrl: string,
        public timeCreated: string
    ) { }
}

export class PreparedData {

    public dataHandler = new DataHandler();

    async prepareVacancies(context: any): Promise<BuildResponseType> {

        let preparedVacancies: IVacancyProps[] = [];

        try {
            const vacanciesResponse = await this.dataHandler.getFoldersFromSP(context, '/sites/Staff/Recruitment/Applications');

            if (!vacanciesResponse.success) {
                throw new Error('Failed to fetch vacancies: ' + JSON.stringify(vacanciesResponse));
            }

            let vacancyData = vacanciesResponse.data.value;

            for (const key of Object.keys(vacancyData)) {
                const singleVacancy = vacancyData[Number(key)];

                let notify = undefined;
                let itemCount = singleVacancy.ItemCount;

                if (singleVacancy.ListItemAllFields.NotifyId != null) {

                    const notifyUsersResponse = await this.buildVacancyNotify(singleVacancy, context)

                    if(!notifyUsersResponse.success){
                        return notifyUsersResponse
                    }

                    notify = [];

                    notify.push(notifyUsersResponse.data);
                    
                }
                const folderEditLink = singleVacancy['@odata.editLink'];

                const vacancyFileDataResponse = await this.buildVacancyFiles(folderEditLink, context)

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

                preparedVacancies.push(new Vacancy(singleVacancy.UniqueId, singleVacancy.Name.slice(0, singleVacancy.Name.indexOf('-')), singleVacancy.Name, createdDateObject, dateClosingObject, formattedCreatedDateObject, formattedClosingDateObject, itemCount,folderEditLink, archived, undefined, vacancyFiles, notify));
            }

        } catch (error) {
            console.log(error);
        }

        return this.dataHandler.buildResponse(true, 'Vacancies prepared successfully', preparedVacancies);
    }

    async addFileToVacancy(context: any, file:FileList | File, vacancyName:string):Promise<BuildResponseType>{

        let response = []

        if(file instanceof FileList){
            for (const key of Object.keys(file)) {
                const singleFile = file[Number(key)];
                let result = await this.dataHandler.uploadFileToSP(context, `${context.pageContext.web.absoluteUrl}`, singleFile, `Applications/${vacancyName}`, true, singleFile.name );

                response.push(result.data);
            }
            return this.dataHandler.buildResponse(true, 'Vacancy Files Added.', response);
        }else{
            let result = await this.dataHandler.uploadFileToSP(context, `${context.pageContext.web.absoluteUrl}`, file, `Applications/${vacancyName}`, true, file.name );

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


}


