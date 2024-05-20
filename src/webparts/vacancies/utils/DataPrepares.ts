import { IFileDataProps, INotifyProps, IVacancyProps } from "../components/Vacancies/IVacancyProps";
import { BuildResponseType, DataHandler } from "./Helpers";

export class Vacancy implements IVacancyProps{
    constructor (
        public uniqueId: number,
        public name: string,
        public originalName: string,
        public closingDate: string,
        public itemCount: number,
        public fileData?: IFileDataProps,
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

                let vacancyFileData = undefined;
                let notify = undefined;

                if (singleVacancy.ListItemAllFields.NotifyId != null) {
                    try {
                        const userDetailsResponse = await this.dataHandler.getUserBySpId(context, singleVacancy.ListItemAllFields.NotifyId);
                        if (!userDetailsResponse.success) {
                            return userDetailsResponse;
                        }

                        notify = [];
                        notify.push(new NotifyUsers(userDetailsResponse.data.Title, userDetailsResponse.data.Email));

                    } catch (error) {
                        console.log(error);
                    }
                }

                try {
                    const folderEditLink = singleVacancy['@odata.editLink'];
                    const pdfFileResponse = await this.dataHandler.getFilesFromFolder(context, folderEditLink);

                    if (!pdfFileResponse.success) {
                        return pdfFileResponse;
                    }

                    if (pdfFileResponse.data.value.length === 1) {
                        vacancyFileData = new FileData(pdfFileResponse.data.value[0].Name, pdfFileResponse.data.value[0].ServerRelativeUrl, pdfFileResponse.data.value[0].TimeCreated);
                    }

                } catch (error) {
                    console.log('An error occurred:', error);
                }

                const dateObject = new Date(singleVacancy.ListItemAllFields.ClosingDate);
                const formattedDateObject = this.formatDate(dateObject);

                preparedVacancies.push(new Vacancy(singleVacancy.UniqueId, singleVacancy.Name.slice(0, singleVacancy.Name.indexOf('-')), singleVacancy.Name, formattedDateObject, singleVacancy.ItemCount, vacancyFileData, notify));
            }

        } catch (error) {
            console.log(error);
        }

        return this.dataHandler.buildResponse(true, 'Vacancies prepared successfully', preparedVacancies);
    }

    private formatDate(dateObject: Date) {
        const yyyy = dateObject.getFullYear();
        let mm = dateObject.getMonth() + 1; // Months start at 0!
        let dd = dateObject.getDate();

        if (dd < 10) dd = 0 + dd;
        if (mm < 10) mm = 0 + mm;

        return `${dd}/${mm}/${yyyy}`;
    }
}


