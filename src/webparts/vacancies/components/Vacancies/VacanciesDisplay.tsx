import * as React from 'react';

import { DataHandler } from '../../utils/Helpers';
import { useEffect, useState } from 'react';
// import { IVacancyProps } from './IVacancyProps';
import { PreparedData } from '../../utils/DataPrepares';
import { useVacanciesContext } from '../context providers/VacanciesContextProvider'
import { useNavigationContext } from '../context providers/NavigationContextProvider';
import Vacancies from './Vacancies';


interface IVacancyDisplayProps{
    context: any;
    children:React.ReactNode;
}

function VacancyDisplay(props: IVacancyDisplayProps){

    const[fetchVacancies, setFetchVacancies] = useState<boolean>(false);

    const { vacancyState, vacancyDispatch } = useVacanciesContext();
    const { state } = useNavigationContext();

    const dataHandler = new DataHandler();

    const dataPrepares = new PreparedData();

    async function getVacancies() {
        try {
            const preparedVacanciesResponse = await dataPrepares.prepareVacancies(props.context);

            if (!preparedVacanciesResponse.success) {
                throw new Error('Failed to prepare vacancies: ' + JSON.stringify(preparedVacanciesResponse));
            }

            console.log('preparedVacanciesResponse before dispatch:', preparedVacanciesResponse.data);

            vacancyDispatch({ type: 'RESET_VACANCIES' });

            vacancyDispatch({ type: 'BULK_ADD_TO_VACANCIES', payload: preparedVacanciesResponse.data });
            // preparedVacanciesResponse.data.forEach((vacancy: IVacancyProps) => {
            //     vacancyDispatch({ type: 'ADD_TO_VACANCIES', payload: vacancy });
            // });
            console.log('Vacancy State after dispatch:', vacancyState);

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
        if(fetchVacancies){
            getVacancyChoices();
            getVacancies();
        }
        
    }, [fetchVacancies]);

    useEffect(() => {
        if (state.path.indexOf('Vacancies') !=-1 && state.path.length === 1) {
            setFetchVacancies(true);
        } else {
            setFetchVacancies(false);
        }
    }, [state.path]);

    return(
        <div id='center-display' style={{display:'flex', flexDirection:'row', gap:'20px', width:'100%', flexWrap:'wrap', justifyContent:'center', overflowY:'scroll', overflow:'hidden'}}>
            {React.Children.map(props.children, (child) => {
            // If the path is equal to 'Vacancies' and the path array length is 1 e.g only vacancies is in the path array, 
            //might need to seriously consider what im doing here because this is a very complex solution to a relatively simple problem.
            //Next: Check if path equals vacancies and then check if the path contains another entry, if so, render the applicant cards and running fetch applicants based off selected vacancy name within path, would be the second entry in the path array.
            if (React.isValidElement(child) && child.type === Vacancies && state.path.indexOf('Vacancies') !=-1 && state.path.length === 1) {
                return child;
            } 
            else {
                return null
            }
        })}
        </div>
    );
}

export default VacancyDisplay