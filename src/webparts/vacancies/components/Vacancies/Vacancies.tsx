import * as React from 'react';
import { useVacanciesContext } from '../context providers/VacanciesContextProvider';
import { ArchiveRegular, DocumentPdfRegular, MoreVerticalFilled } from '@fluentui/react-icons';

interface IVacancyDisplayProps{
    context: any;
}

function Vacancies(props: IVacancyDisplayProps){

    const { vacancyState } = useVacanciesContext();

    console.log(vacancyState.vacancies);

    return(
        <div style={{display:'flex', flexWrap:'wrap', width:'100%', maxWidth:'1000px', gap:'10px'}}>
            {vacancyState.vacancies.length > 0 &&
                vacancyState.vacancies.map((singleVacancy) => (
                    <div style={{display:'flex', flexDirection:'column', boxSizing: 'border-box', borderRadius:'6px', border:'1px solid lightgray', overflow:'hidden', width:'320px', height:'400px', padding:'15px'}} key={singleVacancy.uniqueId}>
                        <div id='top-row-info' style={{display:'flex', flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                            <div id='alert-medal-box' style={{display:'flex', boxSizing:'border-box', padding:'4px 8px', backgroundColor:'#fceef4', color:'#9d2b6b', fontSize:'12px', fontWeight:'600', borderRadius:'4px', alignSelf: 'baseline'}}>
                                <span>Expiring Soon</span>
                            </div>

                            <div id='option-menu-container' style={{display:'flex', flexDirection:'column', position:'relative'}}>
                                <div id='more-button' style={{display:'flex', boxSizing:'border-box', justifyContent:'center', alignItems:'center', padding:'10px', fontSize:'20px'}}>
                                    <MoreVerticalFilled/>
                                </div>
                                <div id='options' style={{display:'flex', border:'1px solid lightgray', width:'150px', position:'absolute', top:'40px', left:'-110px', flexDirection:'column', borderRadius:'6px'}}>

                                    <div id='button-option' style={{display:"flex",flexDirection:"row",width:"100%",padding:"10px 10px",boxSizing:"border-box",alignItems:"center",gap:"5px"}}>
                                        <DocumentPdfRegular style={{fontSize:'20px'}}/>
                                        <span>View Pack</span>
                                    </div>

                                    <div id='button-option' style={{display:"flex",flexDirection:"row",width:"100%",padding:"10px 10px",boxSizing:"border-box",alignItems:"center",gap:"5px"}}>
                                        <ArchiveRegular style={{fontSize:'20px'}}/>
                                        <span>Archive Vacancy</span>
                                    </div>

                                </div>
                            </div>


                        </div>
                    </div>  
                ))  
            }
        </div>
    );
}

export default Vacancies