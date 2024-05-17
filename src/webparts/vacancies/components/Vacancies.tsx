import * as React from 'react';
import styles from './Vacancies.module.scss';
import type { IVacanciesProps } from './IVacanciesProps';
import SideBar from './layout/sidebar/Sidebar';
import CentreDisplay from './layout/center display/CentreDisplay';
import { NavigationProvider } from './context providers/NavigationContextProvider';
import TopNav from './layout/center display/TopNav';
import VacancyDisplay from './Vacancies/VacanciesDisplay';
import ContentScreen from './layout/center display/ContentScreen';
// import { DataHandler } from '../utils/Helpers';
// import { useEffect } from 'react';
// import { PreparedData } from '../utils/DataPrepares';

function Recruitment(props: IVacanciesProps){

//   const dataHandler = new DataHandler();

//   const dataPrepares = new PreparedData();

//   console.log(props.context)

//   async function getVacancies() {
//     try {
//         const vacanciesResponse = await dataHandler.getFoldersFromSP(props.context, '/sites/Staff/Recruitment/Applications');

//         if (!vacanciesResponse.success) {
//             throw new Error('Failed to fetch vacancies: ' + JSON.stringify(vacanciesResponse));
//         }
        
//         const preparedVacanciesResponse = await dataPrepares.prepareVacancies(props.context, vacanciesResponse.data.value);

//         if (!preparedVacanciesResponse.success) {
//             throw new Error('Failed to prepare vacancies: ' + JSON.stringify(preparedVacanciesResponse));
//         }

//         console.log(preparedVacanciesResponse.data);

//     } catch (error) {
//         console.error('An error occurred:', error);
//     }
// }


//   //amend this code to correctly utilise buildResponse objects and catch errors.
//   async function getVacancyChoices(){
//     try{
//       const list = await dataHandler.getSPList(props.context);
//       console.log(list.data.value[0].Choices);
//     }catch(error){
//       console.log(error);
//     }
//   }

//   useEffect(  () => {
//     getVacancyChoices();
//     getVacancies();
//   }, []);

  return (
    <main className={styles.vacancies} style={{flexDirection:'row', height:'85vh', width:'100%', position:'relative', border:'solid 1px gray'}}>

      <NavigationProvider>

      <SideBar/>

      <CentreDisplay>
        <TopNav/>
        <ContentScreen>
          <VacancyDisplay context={props.context}/>
        </ContentScreen>
      </CentreDisplay>

      </NavigationProvider>
    </main>
  );

}

export default Recruitment
