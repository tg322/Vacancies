import * as React from 'react';

import { DataHandler } from '../../utils/Helpers';
import { useEffect, useState } from 'react';
// import { IVacancyProps } from './IVacancyProps';
import { PreparedData } from '../../utils/DataPrepares';
import { useVacanciesContext } from '../context providers/VacanciesContextProvider'
import { useNavigationContext } from '../context providers/NavigationContextProvider';
import Vacancies from './Vacancies';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';


interface IVacancyDisplayProps{
    context: any;
    children:React.ReactNode;
}

function VacancyDisplay(props: IVacancyDisplayProps){

    const[fetchVacancies, setFetchVacancies] = useState<boolean>(false);

    const { vacancyDispatch } = useVacanciesContext();
    const { state } = useNavigationContext();

    const dataHandler = new DataHandler();

    const dataPrepares = new PreparedData();

    async function getVacancies() {
        try {
            const preparedVacanciesResponse = await dataPrepares.prepareVacancies(props.context);

            if (!preparedVacanciesResponse.success) {
                throw new Error('Failed to prepare vacancies: ' + JSON.stringify(preparedVacanciesResponse));
            }
            vacancyDispatch({ type: 'RESET_VACANCIES' });
            vacancyDispatch({ type: 'BULK_ADD_TO_VACANCIES', payload: preparedVacanciesResponse.data });
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
        <FluentProvider theme={webLightTheme} style={{width:'100%'}}>
                <div id="center-display" style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%', flexWrap: 'wrap', justifyContent: 'center', overflowY: 'scroll', overflow: 'hidden' }}>
                    {React.Children.map(props.children, (child) => {
                        if (React.isValidElement(child) && child.type === Vacancies && state.path.indexOf('Vacancies') !== -1 && state.path.length === 1) {
                        return React.cloneElement(child, {
                            context: props.context,
                        } as IVacancyDisplayProps);
                        } else {
                        return null;
                        }
                    })}
                </div>
        </FluentProvider>
    );
}

export default VacancyDisplay