import * as React from 'react';
import AppliedForBubble from './AppliedForBubble';
import styles from './Applicants.module.scss';
import { DeleteRegular, EditRegular, WarningFilled } from '@fluentui/react-icons';
import { IApplicantAppliedForProps, IApplicantProps } from './IApplicantProps';
import { useNavigationContext } from '../context providers/NavigationContextProvider';
import { useState } from 'react';

interface ApplicantTableRowProps{
    applicant:IApplicantProps;
    applicantKey:Number;
}

function ApplicantTableRow(props:ApplicantTableRowProps){
    
    const {state} = useNavigationContext();

    const[showMoreAppliedFor, setShowMoreAppliedFor] = useState<Number | null>(null);
    

    return(
        <div className={styles['table-row']}>

            {/* <div style={{display:'flex', boxSizing:'border-box', padding:'5px', borderRadius:'100px', backgroundColor:'red', position:'absolute'}}>

            </div> */}

            <div className={styles['name-email-wrapper']}>
                <div className={styles['name-email-container']}>
                    <span>{props.applicant.name}</span>
                    <span>{props.applicant.email ? props.applicant.email : 'No Email Provided'}</span>
                </div>
            </div>
            {/**Build applied for hover dropdown logic */}

            {/**If there are more than one vacancies applied for, and we are inside a vacancy. put current vacancy at top of list, show +N to denote more than 1 applied for */}
            {props.applicant.appliedFor.length > 1 && state.path.indexOf('Vacancies') !=-1 && 
            <div className={styles['applied-for-container']} style={{position:'relative'}}>
                <AppliedForBubble bgColor='#CAF0CC' color='#437406' vacancyName={props.applicant.appliedFor.filter((item: IApplicantAppliedForProps) => item.vacancyName === state.path[1])[0].vacancyName.slice(0, props.applicant.appliedFor.filter((item: IApplicantAppliedForProps) => item.vacancyName === state.path[1])[0].vacancyName.indexOf('-'))}/>
                <div className={styles['total-applied-for-container']} onMouseOver={() => setShowMoreAppliedFor(props.applicantKey)} onMouseLeave={() => setShowMoreAppliedFor(null)}>
                    <span>+{props.applicant.appliedFor.length - 1}</span>
                    {showMoreAppliedFor && showMoreAppliedFor === props.applicantKey && (
                        <div style={{display:'flex', boxSizing:'border-box', paddingTop:'5px', position:'absolute', zIndex:'2', top:'34px', left:'-3px',}}>
                            <div style={{display:'flex', width:'150px', height:'fit-content', borderRadius:'8px', filter: 'drop-shadow(4px 4px 4px #0000000a)', backgroundColor:'white', flexDirection:'column', paddingTop:'5px', paddingBottom:'5px'}}>
                                {/** .map here on appliedFor */}
                                {props.applicant.appliedFor.map((appliedFor:IApplicantAppliedForProps, key) => {
                                    if(appliedFor.vacancyName != state.path[1]){
                                        return(
                                            <div style={{display:'flex', padding:'3px'}}>
                                                <AppliedForBubble bgColor='#CAF0CC' color='#437406' vacancyName={appliedFor.vacancyName.slice(0, appliedFor.vacancyName.indexOf('-'))}/>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    )}
                </div>
                
                
            </div>
            }

            {/**If there is one vacancy applied for, and we are inside a vacancy, just show applied for */}
            {props.applicant.appliedFor.length === 1 && state.path.indexOf('Vacancies') !=-1 &&
            <div className={styles['applied-for-container']}>
                <AppliedForBubble bgColor='#CAF0CC' color='#437406' vacancyName={props.applicant.appliedFor[0].vacancyName.slice(0, props.applicant.appliedFor[0].vacancyName.indexOf('-'))}/>
            </div>
            }

            {/**If there is one vacancy applied for, and we are not inside a vacancy, just show applied for */}
            {props.applicant.appliedFor.length === 1 && state.path.indexOf('Vacancies') ==-1 &&
            <div className={styles['applied-for-container']}>
                <AppliedForBubble bgColor='#CAF0CC' color='#437406' vacancyName={props.applicant.appliedFor[0].vacancyName.slice(0, props.applicant.appliedFor[0].vacancyName.indexOf('-'))}/>
            </div>
            }

            {/**If there is more than one vacancy applied for, and we are not inside a vacancy, just show applied for + more */}
            {props.applicant.appliedFor.length > 1 && state.path.indexOf('Vacancies') ==-1 &&

            <div className={styles['applied-for-container']} style={{position:'relative'}}>
                <AppliedForBubble bgColor='#CAF0CC' color='#437406' vacancyName={props.applicant.appliedFor[0].vacancyName.slice(0, props.applicant.appliedFor[0].vacancyName.indexOf('-'))}/>
                <div className={styles['total-applied-for-container']} onMouseOver={() => setShowMoreAppliedFor(props.applicantKey)} onMouseLeave={() => setShowMoreAppliedFor(null)}>
                    <span>+{props.applicant.appliedFor.length - 1}</span>
                    {showMoreAppliedFor && showMoreAppliedFor === props.applicantKey && (
                        <div style={{display:'flex', boxSizing:'border-box', paddingTop:'5px', position:'absolute', zIndex:'2', top:'34px', left:'-3px',}}>
                            <div style={{display:'flex', width:'150px', height:'fit-content', borderRadius:'8px', filter: 'drop-shadow(4px 4px 4px #0000000a)', backgroundColor:'white', flexDirection:'column', paddingTop:'5px', paddingBottom:'5px'}}>
                                {/** .map here on appliedFor */}
                                {props.applicant.appliedFor.map((appliedFor:IApplicantAppliedForProps, key) => {
                                    if(key != 0){
                                        return(
                                            <div style={{display:'flex', padding:'3px'}}>
                                                <AppliedForBubble bgColor='#CAF0CC' color='#437406' vacancyName={appliedFor.vacancyName.slice(0, appliedFor.vacancyName.indexOf('-'))}/>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            } 

            {/**If there are no vacancies applied for, display No Vacancies... */}
            {props.applicant.appliedFor.length === 0 && 
            <div className={`${styles['applied-for-container']} ${styles['missing-data']}`}>
                    <span>No data provided</span>
                    <WarningFilled/>
            </div>
            } 
            {props.applicant.telephoneNumber && 
                <div className={styles['tel-no-container']}>
                    <span>{props.applicant.telephoneNumber}</span>
                </div>
            }
            
            {!props.applicant.telephoneNumber && 
            <div className={`${styles['applied-for-container']} ${styles['missing-data']}`}>
                <span>No data provided</span>
                <WarningFilled/>
            </div>
            }
            <div className={styles['status-container']}>
                <AppliedForBubble bgColor='#D4E7F6' color='#0068B8' vacancyName={props.applicant.status}/>
            </div>
            <div className={styles['edit-delete-container']}>
                <div className={styles['edit-delete-button-container']}>
                    <EditRegular/>
                </div>
                <div className={styles['edit-delete-button-container']}>
                    <DeleteRegular/>
                </div>
            </div>

        </div>
    );
}

export default ApplicantTableRow