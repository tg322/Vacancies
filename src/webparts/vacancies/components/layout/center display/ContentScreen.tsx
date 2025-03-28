import * as React from 'react';
import { useNavigationContext } from '../../context providers/NavigationContextProvider';
import VacancyDisplay from '../../Vacancies/VacanciesDisplay';
import ApplicantsDisplay from '../../Applicants/ApplicantsDisplay';

interface IContentScreenProps{
    children: React.ReactNode;
}

function ContentScreen(props: IContentScreenProps){

    const { state } = useNavigationContext();

    return(
        <div id='content-screen' style={{display:'flex', flexDirection:'column', height:'100%', width:'100%', alignItems:'center', overflowY:'auto', padding:'0px 20px', boxSizing:'border-box'}}>
            {React.Children.map(props.children, (child) => {
                // if path is vacancies and nothing else, show vacancies
                if (React.isValidElement(child) && child.type === VacancyDisplay && state.path.indexOf('Vacancies') !=-1 && state.path.length === 1) {
                    return child;
                    // if path is vacancies, vacancyName, show applicants
                } else if (React.isValidElement(child) && child.type === ApplicantsDisplay && state.path.indexOf('Vacancies') !=-1 && state.path.length > 1) {
                    return child;
                    // if path is archive, show vacancies
                } else if (React.isValidElement(child) && child.type === ApplicantsDisplay && state.path.indexOf('Applicants') !=-1 && state.path.length === 1) {
                    return child;
                    // if path is archive, show vacancies
                } else if (React.isValidElement(child) && child.type === VacancyDisplay && state.path.indexOf('Archive') !=-1 && state.path.length === 1) {
                    return child;
                    // if path is held on file, show applicants
                } else if (React.isValidElement(child) && child.type === ApplicantsDisplay && state.path.indexOf('Held on File') !=-1 && state.path.length === 1){
                    return child;
                } else{
                    return null;
                }
            })}
        </div>
    );
}

export default ContentScreen