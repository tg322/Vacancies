import * as React from 'react';
import { useNavigationContext } from '../../context providers/NavigationContextProvider';
import VacancyDisplay from '../../Vacancies/VacanciesDisplay';

interface IContentScreenProps{
    children: React.ReactNode;
}

function ContentScreen(props: IContentScreenProps){

    const { state } = useNavigationContext();

    return(
        <div id='content-screen' style={{display:'flex', flexDirection:'column', height:'100%', width:'100%'}}>
        {React.Children.map(props.children, (child) => {
            // Check if the child is a valid React element and of the specific type
            if (React.isValidElement(child) && child.type === VacancyDisplay && state.path.indexOf('Vacancies') !=-1 && state.path.length === 1) {
                return child;
            } else if (state.path.indexOf('Archive') !=-1 && state.path.length === 1) {
                return <>Archive</>;
            } else if (state.path.indexOf('Held on File') !=-1 && state.path.length === 1) {
                return <>Held on File</>;
            } else {
                return null
            } // or return some default component if you prefer
        })}
    </div>
    );
}

export default ContentScreen