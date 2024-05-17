import { DataHandler } from "./Helpers";

interface INotifyProps{
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

export class vacancy implements IVacancyProps{
    constructor (
        public uniqueId: number,
        public name: string,
        public closingDate: string,
        public itemCount: number,
        public accessibleTo?: INotifyProps[]
    ) { }
  }

export class notifyUsers implements INotifyProps{
    constructor (
        public name: string,
        public email: string
    ) { }
}

export class PreparedData {

    public dataHandler = new DataHandler();

    async prepareVacancies(context:any, vacancyData:Array<any>){

        let preparedVacancies:IVacancyProps[] = [];

        Object.keys(vacancyData).map(async (key) => {
            const singleVacancy = vacancyData[Number(key)];

            let notify = undefined;

            if(singleVacancy.ListItemAllFields.NotifyId != null){
                try{
                    const userDetailsResponse = await this.dataHandler.getUserBySpId(context, singleVacancy.ListItemAllFields.NotifyId);
                    if(!userDetailsResponse.success){
                        return userDetailsResponse;
                    }

                    notify = [];
                    notify.push(new notifyUsers(userDetailsResponse.data.Title, userDetailsResponse.data.Email));
                    
                }catch(error){
    
                }
            }
            
            preparedVacancies.push(new vacancy(singleVacancy.UniqueId, singleVacancy.Name.slice(0,singleVacancy.Name.indexOf('-')), singleVacancy.ListItemAllFields.ClosingDate, singleVacancy.ItemCount, notify))
        });

        // console.log(preparedVacancies);

        

        return this.dataHandler.buildResponse(true, 'Vacancies prepared successfully', preparedVacancies)
    }

}

