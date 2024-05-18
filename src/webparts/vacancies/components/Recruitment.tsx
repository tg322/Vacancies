import * as React from 'react';
import styles from './Vacancies.module.scss';
import type { IVacanciesProps } from './IVacanciesProps';
import SideBar from './layout/sidebar/Sidebar';
import CentreDisplay from './layout/center display/CentreDisplay';
import { NavigationProvider } from './context providers/NavigationContextProvider';
import TopNav from './layout/center display/TopNav';
import VacancyDisplay from './Vacancies/VacanciesDisplay';
import ContentScreen from './layout/center display/ContentScreen';
import { VacanciesProvider } from './context providers/VacanciesContextProvider';
// import { DataHandler } from '../utils/Helpers';
// import { useEffect } from 'react';
// import { PreparedData } from '../utils/DataPrepares';

function Recruitment(props: IVacanciesProps){

  return (
    <NavigationProvider>
      <VacanciesProvider>
        <main className={styles.vacancies} style={{flexDirection:'row', height:'85vh', width:'100%', position:'relative', border:'solid 1px gray'}}>

          <SideBar/>

          <CentreDisplay>
            <TopNav/>
            <ContentScreen>
              <VacancyDisplay context={props.context}/>
            </ContentScreen>
          </CentreDisplay>
          
        </main>
      </VacanciesProvider>
    </NavigationProvider>
  );

}

export default Recruitment
