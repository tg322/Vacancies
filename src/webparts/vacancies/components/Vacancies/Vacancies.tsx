import * as React from 'react';
import { useVacanciesContext } from '../context providers/VacanciesContextProvider';
import { useEffect, useState } from 'react';
import styles from './Vacancies.module.scss';
import EditVacancyModal from './EditVacancyModal';
import { useVacancyContext } from '../context providers/SingleVacancyContextProvider';
import { IVacancyProps } from './IVacancyProps';
import VacancyCard from './VacancyCard';
import VacanciesFilterBarButton from './VacanciesFilterBarButton';
import { useNavigationContext } from '../context providers/NavigationContextProvider';
import NewVacancyModal from './NewVacancyModal';

export interface IVacancyDisplayProps{
    context: any;
}

function Vacancies(props: IVacancyDisplayProps){

    const[showEditModal, setShowEditModal] = useState<boolean>(false);

    const[showNewModal, setShowNewModal] = useState<boolean>(false);

    const[selectedKey, setSelectedKey] = useState<number>(-1);

    const { vacancyState, vacancyDispatch } = useVacanciesContext();

    const { state } = useNavigationContext();

    const { singleVacancyState, singleVacancyDispatch } = useVacancyContext();

    const [selectedFilterButton, setSelectedFilterButton] = useState<number>(1);

    const [filteredVacancies, setFilteredVacancies] = useState<IVacancyProps[]>([]);



    function editVacancy(vacancy:IVacancyProps, key:number){
        singleVacancyDispatch({ type: 'ADD_TO_VACANCY', payload: vacancy });
        setShowEditModal(true);
        setSelectedKey(key);
    }

    function closeDialog(){
        //issue: if I am setting anything on close in modal, this will overwrite the state when something might not have been confirmed...
        if(singleVacancyState.vacancy){
            vacancyDispatch({ type: 'REPLACE_VACANCY', payload: singleVacancyState.vacancy })
        }
        setShowEditModal(false);
        setSelectedFilterButton(1);
    }

    useEffect(  () => {
        if(vacancyState.vacancies){
            if(state.path[0] === 'Vacancies'){
                setFilteredVacancies(vacancyState.vacancies.filter((item: any) => item.archived === false));
            }else{
                setFilteredVacancies(vacancyState.vacancies.filter((item: any) => item.archived === true));
            }
            
        }
        
    }, [vacancyState, state]);

    useEffect(  () => {
        console.log(filteredVacancies);
        
    }, [filteredVacancies]);

    function submitDialog() {
        if(singleVacancyState.vacancy){
            console.log('replacing vacancy...', singleVacancyState.vacancy)
            vacancyDispatch({ type: 'REPLACE_VACANCY', payload: singleVacancyState.vacancy })
        }
        setShowEditModal(false);
        setSelectedFilterButton(1);
    }

    function onSelectFilterButton(key:number){
        setSelectedFilterButton(key);
        if(vacancyState.vacancies){
            switch (key) {
                case 1:
                    setFilteredVacancies(vacancyState.vacancies);
                    break;
                case 2:
                    const openVacancies = vacancyState.vacancies.filter(vacancy => vacancy.status === 'open');
                    setFilteredVacancies(openVacancies);
                    break;
                case 3:
                    const closingVacancies = vacancyState.vacancies.filter(vacancy => vacancy.status === 'closing soon');
                    setFilteredVacancies(closingVacancies);
                    break;
                case 4:
                    const closedVacancies = vacancyState.vacancies.filter(vacancy => vacancy.status === 'closed');
                    setFilteredVacancies(closedVacancies);
                    break;
                default:
                    break;
            }
        }
    }

    function closeNewDialog(){
        setShowNewModal(false);
    }

    function submitNewDialog(){
        setShowNewModal(false);
    }

    return(
        <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'20px', boxSizing:'border-box', paddingBottom:'20px'}}>
        <div style={{display:'flex', flexDirection:'row', height:'55px', boxSizing:'border-box', padding:'10px 20px', width:'100%', borderBottom:'solid 1px lightgray', justifyContent:'space-between'}}>
            <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
                <VacanciesFilterBarButton title='All' total={vacancyState.vacancies.length} selected={selectedFilterButton} itemKey={1} onSelect={onSelectFilterButton} bgColor='#000f5b' txtColor='white'/>
                <VacanciesFilterBarButton title='Open' total={vacancyState.vacancies.filter(vacancy => vacancy.status === 'open').length} selected={selectedFilterButton} itemKey={2} onSelect={onSelectFilterButton} bgColor='#b2dbba' txtColor='#0d8826'/>
                <VacanciesFilterBarButton title='Closing Soon' total={vacancyState.vacancies.filter(vacancy => vacancy.status === 'closing soon').length} selected={selectedFilterButton} itemKey={3} onSelect={onSelectFilterButton} bgColor='#ffe3b2' txtColor='#a8820c'/>
                <VacanciesFilterBarButton title='Closed' total={vacancyState.vacancies.filter(vacancy => vacancy.status === 'closed').length} selected={selectedFilterButton} itemKey={4} onSelect={onSelectFilterButton} bgColor='#ffc5c5' txtColor='#9e1212'/>
            </div>
            
            <span onClick={() => setShowNewModal(true)}>New +</span>
        </div>

        <div className={styles['vacancies-wrapper']}>
            {filteredVacancies.length > 0 &&
                filteredVacancies.map((singleVacancy, key) => {
                    return(
                        <VacancyCard vacancy={singleVacancy} editVacancy={editVacancy}/>
                    )})
            }
            {filteredVacancies.length === 0 && 
                <p>No Vacancies</p>
            }
        </div>
        
        <EditVacancyModal context={props.context} openDialog={showEditModal} closeDialog={closeDialog} selectedVacancyKey={selectedKey} submitDialog={submitDialog}/>
        <NewVacancyModal context={props.context} openDialog={showNewModal} closeDialog={closeNewDialog} submitDialog={submitNewDialog}/>

        </div>
    );
}

export default Vacancies