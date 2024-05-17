import * as React from 'react';
import { IVacancyProps, PreparedData } from '../../utils/DataPrepares';
import { DataHandler } from '../../utils/Helpers';
import { useEffect, useState } from 'react';

interface IVacancyDisplayProps{
    context: any;
}

function VacancyDisplay(props: IVacancyDisplayProps){

    const[vacancyDetails, setVacancyDetails] = useState<Array<IVacancyProps>>([])

    const dataHandler = new DataHandler();

    const dataPrepares = new PreparedData();

    async function getVacancies() {
        try {
            const vacanciesResponse = await dataHandler.getFoldersFromSP(props.context, '/sites/Staff/Recruitment/Applications');

            if (!vacanciesResponse.success) {
                throw new Error('Failed to fetch vacancies: ' + JSON.stringify(vacanciesResponse));
            }
            
            const preparedVacanciesResponse = await dataPrepares.prepareVacancies(props.context, vacanciesResponse.data.value);

            if (!preparedVacanciesResponse.success) {
                throw new Error('Failed to prepare vacancies: ' + JSON.stringify(preparedVacanciesResponse));
            }

            setVacancyDetails(preparedVacanciesResponse.data);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


    //amend this code to correctly utilise buildResponse objects and catch errors.
    async function getVacancyChoices(){
        try{
        const list = await dataHandler.getSPList(props.context);
        console.log(list.data.value[0].Choices);
        }catch(error){
        console.log(error);
        }
    }

    useEffect(  () => {
        getVacancyChoices();
        getVacancies();
    }, []);

    return(
        <div id='center-display' style={{display:'flex', flexDirection:'column', gap:'20px'}}>
            {vacancyDetails.length > 0 &&
                vacancyDetails.map((singleVacancy) => (
                    <div style={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', padding: '10px', border: '1px solid black' }} key={singleVacancy.uniqueId}>
                        <span>{singleVacancy.name}</span>
                        <span>{singleVacancy.uniqueId}</span>
                        <span>{singleVacancy.accessibleTo?.length}</span>
                        <span>{singleVacancy.closingDate}</span>
                        <span>{singleVacancy.itemCount}</span>
                    </div>
                ))
            }
        </div>
    );
}

export default VacancyDisplay