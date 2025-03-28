import * as React from 'react';

// import { DataHandler } from '../../utils/Helpers';
import { useEffect, useState } from 'react';
// import { IVacancyProps } from './IVacancyProps';
import { PreparedData } from '../../utils/DataPrepares';
import { useVacanciesContext } from '../context providers/VacanciesContextProvider'
import { useNavigationContext } from '../context providers/NavigationContextProvider';
import Vacancies from './Vacancies';
import { FluentProvider, Spinner, SpinnerProps, webLightTheme } from '@fluentui/react-components';


interface IVacancyDisplayProps{
    context: any;
    children:React.ReactNode;
}

function VacancyDisplay(props: IVacancyDisplayProps, spinnerProps: Partial<SpinnerProps>){

    // const[fetchVacancies, setFetchVacancies] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);

    const { vacancyDispatch } = useVacanciesContext();
    const { state } = useNavigationContext();

    // const dataHandler = new DataHandler();

    const dataPrepares = new PreparedData();

    async function getActiveVacancies() {
        setFetching(true);
        try {
            const preparedVacanciesResponse = await dataPrepares.getVacancies(props.context);

            if (!preparedVacanciesResponse.success) {
                console.log(preparedVacanciesResponse);
                throw new Error('Failed to prepare vacancies: ' + JSON.stringify(preparedVacanciesResponse.error));
                
            }
            console.log(preparedVacanciesResponse);
            vacancyDispatch({ type: 'RESET_VACANCIES' });
            vacancyDispatch({ type: 'BULK_ADD_TO_VACANCIES', payload: preparedVacanciesResponse.data });
            setFetching(false);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    async function getArchivedVacancies() {
        setFetching(true);
        try {
            const preparedVacanciesResponse = await dataPrepares.getArchivedVacancies(props.context);

            if (!preparedVacanciesResponse.success) {
                console.log(preparedVacanciesResponse);
            }
            vacancyDispatch({ type: 'RESET_VACANCIES' });
            vacancyDispatch({ type: 'BULK_ADD_TO_VACANCIES', payload: preparedVacanciesResponse.data });
            setFetching(false);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    useEffect( () => {
        if (state.path.indexOf('Vacancies') !=-1){
            getActiveVacancies();
        }else if(state.path.indexOf('Archive') !=-1){
            getArchivedVacancies();
        }
    }, [state]);

    //possibly not needed...
    // useEffect(() => {
    //     if (state.path.indexOf('Vacancies') !=-1 && state.path.length === 1) {
    //         setFetchVacancies(true);
    //     } else {
    //         setFetchVacancies(false);
    //     }
    // }, [state.path]);

        return(
        
            <div id="center-display" style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%', height:'100%', flexWrap: 'wrap', justifyContent: 'center', overflowY: 'scroll', overflow: 'hidden', maxWidth:'1040px', padding:'10px 20px', boxSizing:'border-box' }}>
                <FluentProvider theme={webLightTheme} style={{width:'100%'}}>
                    {React.Children.map(props.children, (child) => {
                        if (React.isValidElement(child) && child.type === Vacancies) {
                            if(!fetching){
                                return React.cloneElement(child, {
                                    context: props.context,
                                } as IVacancyDisplayProps);
                            }else{
                                return(<div style={{display:'flex', flexDirection:'column', width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                                    <Spinner {...spinnerProps} label={'Loading Vacancies ...'} labelPosition='below'/>
                                </div>);
                            }
                        } else {
                        return null;
                        }
                    })}
                </FluentProvider>
            </div>
    
        );
    
    }

export default VacancyDisplay