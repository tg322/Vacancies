import * as React from 'react';
import styles from './SideBar.module.scss';
import SideBarButton from './SideBarButton';
import { ArchiveFilled, FolderBriefcaseFilled, DocumentPersonFilled, PersonAccountsFilled } from '@fluentui/react-icons';
import ButtonGroupContainer from './ButtonGroupContainer';

function SideBar(){

    return(
        <div id='sidebar' className={styles.sidebar}>  

            <div id='sidebar-title' className={styles.sidebarTitle}>
                <h2 style={{fontWeight:'600', margin:'0px'}}>Recruitment</h2>
            </div>
            <ButtonGroupContainer>
                <SideBarButton title='Vacancies' icon={<FolderBriefcaseFilled />} id='Vacancies' />
                <SideBarButton title='Applicants' icon={<PersonAccountsFilled />} id='Applicants' />
                <SideBarButton title='Archive' icon={<ArchiveFilled/>} id='Archive' />
                <SideBarButton title='Held on File' icon={<DocumentPersonFilled/>} id='Held on File' />
            </ButtonGroupContainer>
            

        </div>
    );
}

export default SideBar