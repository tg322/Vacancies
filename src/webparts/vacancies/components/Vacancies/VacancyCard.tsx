import * as React from 'react';
import { IVacancyProps } from './IVacancyProps';
import { ArchiveRegular, EditRegular, MoreVerticalFilled } from '@fluentui/react-icons';
import styles from './Vacancies.module.scss';
import { useState } from 'react';
import { useNavigationContext } from '../context providers/NavigationContextProvider';

interface IVacancyCardProps{
    vacancy:IVacancyProps;
    editVacancy(vacancy:IVacancyProps, key:number): void
}

function VacancyCard(props: IVacancyCardProps){

    const[showOptions, setShowOptions] = useState<boolean>(false);
    const { dispatch } = useNavigationContext();

    const twoWeeksBeforeClosing = new Date(props.vacancy.closingDate.getTime() - 14 * 24 * 60 * 60 * 1000);

    const today = new Date();
    return(
        <div id='vacancyContainer' className={styles['vacancy-container']}>

                        <div id='topRowInfo' className={styles['top-row-info']} >
                            {today >= twoWeeksBeforeClosing && today < props.vacancy.closingDate && 
                                <div id='alertMedalBox' className={`${styles['alert-medal-box']} ${styles['alert-medal-box-closing']}`} >
                                    <span>Closing Soon</span>
                                </div>
                            }
                            {today > props.vacancy.closingDate &&
                                <div id='alertMedalBox' className={`${styles['alert-medal-box']} ${styles['alert-medal-box-closed']}`} >
                                    <span>Closed</span>
                                </div>
                            }
                            
                            <div id='optionMenuContainer' className={styles['option-menu-container']}>

                                <div id='moreButton' className={styles['more-button']} onClick={(e) => setShowOptions(!showOptions)}>
                                    <MoreVerticalFilled/>
                                </div>

                                { showOptions  && <div id='options' className={styles['options']} >

                                    <div id='buttonOption' className={styles['button-option']} onClick={(e) =>  {props.editVacancy(props.vacancy, props.vacancy.uniqueId); setShowOptions(false)}}>
                                        <EditRegular style={{fontSize:'20px'}}/>
                                        <span>Edit Vacancy</span>
                                    </div>

                                    <div id='buttonOption' className={styles['button-option']} onClick={(e) =>  e.stopPropagation}>
                                    <ArchiveRegular style={{fontSize:'20px'}}/>
                                        <span>Archive Vacancy</span>
                                    </div>

                                </div>}

                            </div>
                        </div>

                        <div id='vacancy-details' className={styles['vacancy-details']}>
                            <span id='vacancy-title' className={styles['vacancy-title']} onClick={() => dispatch({ type: 'ADD_TO_PATH', payload: props.vacancy.originalName })} >{props.vacancy.name}</span>

                            <div id='vacancy-total-applicants' className={styles['vacancy-total-applicants']}>
                                <span>Total Applicants</span>
                                <div id='item-count-bubble' className={styles['item-count-bubble']}>
                                    <span>{props.vacancy.itemCount}</span>
                                </div>
                            </div>

                            <div id='vacancy-closing-date' className={styles['vacancy-closing-date']}>
                                <span>Closing Date</span>
                                <div id='closing-date-bubble' className={styles['closing-date-bubble']}>
                                    <span>{props.vacancy.formattedClosingDate}</span>
                                </div>
                            </div>
                            <span style={{fontSize:'10px', color:'gray'}}>Created <span style={{fontWeight:'600'}}>{props.vacancy.formattedCreated}</span></span>
                        </div>
                    </div>  
    );

}

export default VacancyCard