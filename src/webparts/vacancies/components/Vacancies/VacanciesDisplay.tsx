import * as React from 'react';

import { DataHandler } from '../../utils/Helpers';
import { useEffect } from 'react';
// import { IVacancyProps } from './IVacancyProps';
import { PreparedData } from '../../utils/DataPrepares';
import { useVacanciesContext } from '../context providers/VacanciesContextProvider';
import { IVacancyProps } from './IVacancyProps';

interface IVacancyDisplayProps{
    context: any;
}

function VacancyDisplay(props: IVacancyDisplayProps){

    // const[vacancyDetails, setVacancyDetails] = useState<Array<IVacancyProps>>([])

    const { state ,dispatch } = useVacanciesContext();

    const dataHandler = new DataHandler();

    const dataPrepares = new PreparedData();

    async function getVacancies() {
        try {
            const vacanciesResponse = await dataHandler.getFoldersFromSP(props.context, '/sites/Staff/Recruitment/Applications');

            if (!vacanciesResponse.success) {
                throw new Error('Failed to fetch vacancies: ' + JSON.stringify(vacanciesResponse));
            }
            console.log(vacanciesResponse.data);
            const preparedVacanciesResponse = await dataPrepares.prepareVacancies(props.context, vacanciesResponse.data.value);

            if (!preparedVacanciesResponse.success) {
                throw new Error('Failed to prepare vacancies: ' + JSON.stringify(preparedVacanciesResponse));
            }

            dispatch({ type: 'RESET_VACANCIES' });

            preparedVacanciesResponse.data.forEach((vacancy: IVacancyProps) => {
                dispatch({ type: 'ADD_TO_VACANCIES', payload: vacancy });
            });

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
        <div id='center-display' style={{display:'flex', flexDirection:'row', gap:'20px', maxWidth:'800px', width:'100%', flexWrap:'wrap', justifyContent:'center'}}>
            {state.vacancies.length > 0 &&
                state.vacancies.map((singleVacancy) => (
                    <div style={{display:'flex', flexDirection:'column', boxSizing: 'border-box', borderRadius:'10px', border:'1px solid lightgray', overflow:'hidden', width:'320px'}} key={singleVacancy.uniqueId}>
                        <div style={{display:'flex', flexDirection:'column', boxSizing: 'border-box', backgroundColor:'lightsalmon', padding:'10px'}}>
                            <span style={{fontWeight:'600'}}>{singleVacancy.name}</span>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', boxSizing: 'border-box', padding:'10px'}}>
                            <span>{singleVacancy.uniqueId}</span>
                            <span>{singleVacancy.accessibleTo?.length}</span>
                            <span>{singleVacancy.closingDate}</span>
                            <span>{singleVacancy.itemCount}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default VacancyDisplay