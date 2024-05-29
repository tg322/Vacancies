import * as React from 'react';
import { useVacanciesContext } from '../context providers/VacanciesContextProvider';
import { useEffect, useState } from 'react';
import styles from './Vacancies.module.scss';
import EditVacancyModal from './EditVacancyModal';
import { useVacancyContext } from '../context providers/SingleVacancyContextProvider';
import { IVacancyProps } from './IVacancyProps';
import VacancyCard from './VacancyCard';

export interface IVacancyDisplayProps{
    context: any;
}

function Vacancies(props: IVacancyDisplayProps){

    const[showModal, setShowModal] = useState<boolean>(false);

    const[selectedKey, setSelectedKey] = useState<number>(-1);

    const { vacancyState, vacancyDispatch } = useVacanciesContext();

    const { singleVacancyState, singleVacancyDispatch } = useVacancyContext();



    function editVacancy(vacancy:IVacancyProps, key:number){
        singleVacancyDispatch({ type: 'ADD_TO_VACANCY', payload: vacancy })
        setShowModal(true);
        setSelectedKey(key);
    }

    function closeDialog(){
        //issue: if I am setting anything on close in modal, this will overwrite the state when something might not have been confirmed...
        if(singleVacancyState.vacancy){
            vacancyDispatch({ type: 'REPLACE_VACANCY', payload: singleVacancyState.vacancy })
        }
        setShowModal(false);
    }

    useEffect(  () => {
        if(vacancyState.vacancies){
            console.log(vacancyState.vacancies)
        }
        
    }, [vacancyState]);

    function submitDialog() {
        if(singleVacancyState.vacancy){
            console.log('replacing vacancy...', singleVacancyState.vacancy)
            vacancyDispatch({ type: 'REPLACE_VACANCY', payload: singleVacancyState.vacancy })
        }
        setShowModal(false);
    }

    return(
        <>

        <div className={styles['vacancies-wrapper']}>
            {vacancyState.vacancies.length > 0 &&
                vacancyState.vacancies.map((singleVacancy, key) => {
                    return(
                        
                        <VacancyCard vacancy={singleVacancy} editVacancy={editVacancy}/>
                        
                    )})
            }
        </div>
        
        <EditVacancyModal context={props.context} openDialog={showModal} closeDialog={closeDialog} selectedVacancyKey={selectedKey} submitDialog={submitDialog}/>

        </>
    );
}

export default Vacancies