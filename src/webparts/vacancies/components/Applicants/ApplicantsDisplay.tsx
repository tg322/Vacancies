import * as React from 'react';

// import { DataHandler } from '../../utils/Helpers';

// import { IVacancyProps } from './IVacancyProps';

import { useNavigationContext } from '../context providers/NavigationContextProvider';
import { FluentProvider, Spinner, SpinnerProps, webLightTheme } from '@fluentui/react-components';
import Applicants from './Applicants';
import { PreparedData } from '../../utils/DataPrepares';
import { useApplicantsContext } from '../context providers/ApplicantsContextProvider';
import { useEffect, useState } from 'react';
interface IApplicantsDisplayProps{
    context: any;
    children:React.ReactNode;
}

function ApplicantsDisplay(props: IApplicantsDisplayProps, spinnerProps: Partial<SpinnerProps>){

    // const[fetchVacancies, setFetchVacancies] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);

    const dataPrepares = new PreparedData();

    const {applicantDispatch} = useApplicantsContext();

    const {state} = useNavigationContext();

    async function getVacancyApplicants() {
        setFetching(true);
        try{
            const applicantsResponse = await dataPrepares.getVacancyApplicants(props.context, state.path[1]);

            if(!applicantsResponse.success){
                throw new Error('Failed to fetch applicants: ' + JSON.stringify(applicantsResponse));
            }

            applicantDispatch({ type: 'RESET_APPLICANTS' });
            applicantDispatch({ type: 'BULK_ADD_TO_APPLICANTS', payload: applicantsResponse.data });
            setFetching(false);
        }catch(e){
            console.log(e);
        }

        
    }

    async function getAllApplicants() {
        setFetching(true);
        try{
            const applicantsResponse = await dataPrepares.getAllApplicants(props.context);

            if(!applicantsResponse.success){
                throw new Error('Failed to fetch applicants: ' + JSON.stringify(applicantsResponse));
            }

            applicantDispatch({ type: 'RESET_APPLICANTS' });
            applicantDispatch({ type: 'BULK_ADD_TO_APPLICANTS', payload: applicantsResponse.data });
            setFetching(false);
        }catch(e){
            console.log(e);
        }

        
    }

    async function getHeldOnFileApplicants() {
        setFetching(true);
        try{
            const applicantsResponse = await dataPrepares.getHeldOnFileApplicants(props.context);

            if(!applicantsResponse.success){
                throw new Error('Failed to fetch applicants: ' + JSON.stringify(applicantsResponse));
            }

            applicantDispatch({ type: 'RESET_APPLICANTS' });
            applicantDispatch({ type: 'BULK_ADD_TO_APPLICANTS', payload: applicantsResponse.data });
            setFetching(false);
        }catch(e){
            console.log(e);
        }

        
    }

    useEffect( () => {
        if (state.path.indexOf('Vacancies') !=-1){
            getVacancyApplicants();
        }else if(state.path.indexOf('Applicants') !=-1){
            getAllApplicants();
        }else if(state.path.indexOf('Held on File') !=-1){
            getHeldOnFileApplicants();
        }
    }, [state]);

        return(
        
            <div id="center-display" style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%', height:'100%', flexWrap: 'wrap', justifyContent: 'center', overflowY: 'scroll', overflow: 'hidden', maxWidth:'1040px', padding:'10px 20px', boxSizing:'border-box' }}>
                <FluentProvider theme={webLightTheme} style={{width:'100%'}}>
                    {React.Children.map(props.children, (child) => {
                        if (React.isValidElement(child) && child.type === Applicants) {
                            if(!fetching){
                                return React.cloneElement(child, {
                                    context: props.context,
                                } as IApplicantsDisplayProps);
                            }else{
                                return(<div style={{display:'flex', flexDirection:'column', width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                                    <Spinner {...spinnerProps} label={'Loading Applicants ...'} labelPosition='below'/>
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

export default ApplicantsDisplay