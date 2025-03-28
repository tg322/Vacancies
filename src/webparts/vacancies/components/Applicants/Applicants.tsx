import * as React from 'react';
// import VacanciesFilterBarButton from '../Vacancies/VacanciesFilterBarButton';
import { useApplicantsContext } from '../context providers/ApplicantsContextProvider';
// import AppliedForBubble from './AppliedForBubble';
// import { useNavigationContext } from '../context providers/NavigationContextProvider';
// import { IApplicantAppliedForProps } from './IApplicantProps';
import { Input } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import ApplicantTableRow from './ApplicantTableRow';
import { IApplicantProps } from './IApplicantProps';

interface IApplicantsProps{
    context: any;
}

function Applicants(props: IApplicantsProps){

    const {applicantState} = useApplicantsContext();

    // const {state} = useNavigationContext();

    const [search, setSearch] = useState<string>('');

    const [filteredApplicants, setFilteredApplicants] = useState<IApplicantProps[]>(applicantState.applicants);

    useEffect( () => {
        let lowerCaseQuery = search.toLowerCase();

        let searchFilteredItems = applicantState.applicants.filter(item =>
        item.name.toLowerCase().indexOf(lowerCaseQuery) !== -1
        );

        setFilteredApplicants(searchFilteredItems);

    }, [search]);

    
    return(
        
        <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'20px', boxSizing:'border-box', paddingBottom:'20px'}}>

                <Input type="text" id={"applicant-search-input"} placeholder='Search' value={search} onChange={(e)=> setSearch(e.currentTarget.value)} style={{width:'220px'}}/>
                <div id='table-container' style={{display:'flex', flexDirection:'column', minWidth:'778px', width:'100%', gap:'10px'}}>
                    <div id='table-header' style={{display:'flex', flexDirection:'row', backgroundColor:'#ededf4', borderRadius:'8px', width:'100%', padding:'8px 18px', boxSizing:'border-box'}}>

                        <div style={{display:'flex', width:'28%'}}>
                            <span style={{fontWeight:'600'}}>Name</span>
                        </div>
                        <div style={{display:'flex', width:'22%'}}>
                            <span style={{fontWeight:'600'}}>Applied For</span>
                        </div>
                        <div style={{display:'flex', width:'22%'}}>
                            <span style={{fontWeight:'600'}}>Telephone</span>
                        </div>
                        <div style={{display:'flex', width:'17%'}}>
                            <span style={{fontWeight:'600'}}>Status</span>
                        </div>
                        <div style={{display:'flex', width:'12%'}}>
                            
                        </div>
                        
                    </div>
                    <div style={{display:'flex', width:'100%', gap:'3px', flexDirection:'column'}}>
                    {filteredApplicants && filteredApplicants.map((applicant:IApplicantProps, key) => {
                        
                        return(
                            <ApplicantTableRow key={key} applicant={applicant} applicantKey={key+1}/>
                        );
                    })}
                        
                    </div>
                    
                </div>
            
        </div>
        // <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'20px', boxSizing:'border-box', paddingBottom:'20px'}}>

        //     <div style={{display:'flex', flexDirection:'column'}}>
        //         {/* {state.path.indexOf('Vacancies') !=-1 && 
        //             <div style={{display:'flex', width:'100%'}}>
        //                 <span>Applicants For {state.path[1].slice(0, state.path[1].indexOf('-'))}</span>
        //             </div>
        //         } */}
        //         <div style={{display:'flex', flexDirection:'row', boxSizing:'border-box'}}>
        //             <Label id={"vacancy-name-input"}>
        //             Vacancy Name
        //             </Label>
        //             <Input type="text" id={"vacancy-name-input"} value={search} onChange={(e)=> setSearch(e.currentTarget.value)}/>
        //         </div>
        //         <table style={{overflow:'hidden', borderBottomLeftRadius:'10px', borderBottomRightRadius:'10px', borderSpacing:'0px', borderColor:'lightgray', border:'1px solid lightgray'}}>
                    
        //             <thead style={{backgroundColor:'#f1f1f1'}}>
        //                 <tr>
        //                     <th style={{padding: '6px 12px 6px 8px'}}><span style={{fontSize:'14px', fontWeight:'400'}}>Name</span></th>
        //                     <th style={{padding: '6px 8px 6px 8px'}}><span style={{fontSize:'14px', fontWeight:'400'}}>Applied For</span></th>
        //                     <th style={{padding: '6px 8px 6px 6px'}}><span style={{fontSize:'14px', fontWeight:'400'}}>Telephone</span></th>
        //                     <th style={{padding: '6px 8px 6px 8px'}}><span style={{fontSize:'14px', fontWeight:'400'}}>Status</span></th>
        //                     <th style={{padding: '6px 8px 6px 12px'}}></th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //             {applicantState && applicantState.applicants.map((applicant, key) => {
        //                 //Do filter on applied for, put current vacancy to top of array list.
        //                 return(
        //                     <tr key={key}>
        //                         <td style={{padding: '6px 12px 6px 8px'}}>{applicant.name}</td>
        //                         {applicant.appliedFor.length > 1 && state.path.indexOf('Vacancies') !=-1 &&
                                
        //                             <td  style={{padding: '6px 8px 6px 8px'}}>
        //                                 <div style={{display:'flex', flexDirection:'row', gap:'10px', alignItems:'center'}}>
        //                                     <AppliedForBubble vacancyName={applicant.appliedFor.filter((item: IApplicantAppliedForProps) => item.vacancyName === state.path[1])[0].vacancyName} />
        //                                     <div style={{display:'flex', padding:'4px 5px', backgroundColor:'lightgray', width:'fit-content', boxSizing:'border-box', borderRadius:'6px'}}>
        //                                         <span>+{applicant.appliedFor.length - 1}</span>
        //                                     </div>
        //                                 </div>
        //                             </td>

        //                         }
        //                         {applicant.appliedFor.length === 1 && state.path.indexOf('Vacancies') !=-1 &&
        //                             <td  style={{padding: '6px 8px 6px 8px'}}>
        //                                 <div style={{display:'flex', flexDirection:'row', gap:'10px', alignItems:'center'}}>
        //                                     <AppliedForBubble vacancyName={applicant.appliedFor[0].vacancyName} />
        //                                 </div>
        //                             </td>
        //                         }
        //                         {applicant.appliedFor.length === 1 && state.path.indexOf('Vacancies') ==-1 &&
        //                             <td  style={{padding: '6px 8px 6px 8px'}}>
        //                                 <div style={{display:'flex', flexDirection:'row', gap:'10px', alignItems:'center'}}>
        //                                     <AppliedForBubble vacancyName={applicant.appliedFor[0].vacancyName} />
        //                                 </div>
        //                             </td>
        //                         }
        //                         {applicant.appliedFor.length > 1 && state.path.indexOf('Vacancies') ==-1 &&
        //                             <td  style={{padding: '6px 8px 6px 8px'}}>
        //                                 <div style={{display:'flex', flexDirection:'row', gap:'10px', alignItems:'center'}}>
        //                                     <AppliedForBubble vacancyName={applicant.appliedFor[0].vacancyName} />
        //                                     <div style={{display:'flex', padding:'4px 5px', backgroundColor:'lightgray', width:'fit-content', boxSizing:'border-box', borderRadius:'6px'}}>
        //                                         <span>+{applicant.appliedFor.length - 1}</span>
        //                                     </div>
        //                                 </div>
        //                             </td>
        //                         }
        //                         {applicant.appliedFor.length === 0 &&
        //                             <td  style={{padding: '6px 8px 6px 8px'}}>
        //                                 <div style={{display:'flex', flexDirection:'row', gap:'10px', alignItems:'center'}}>
        //                                     <span>No vacancies applied for.</span>
        //                                 </div>
        //                             </td>
        //                         }
        //                         <td style={{padding: '6px 8px 6px 8px'}}>07123456789</td>
        //                         <td style={{padding: '6px 8px 6px 8px'}}>Short Listed</td>
        //                         <td style={{padding: '6px 8px 6px 12px'}}></td>
        //                     </tr>
        //                 );
        //             })}
        //             </tbody>
        //         </table>
        //     </div>
        // </div>
    );
}
export default Applicants