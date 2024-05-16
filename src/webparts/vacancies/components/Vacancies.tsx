import * as React from 'react';
import styles from './Vacancies.module.scss';
import type { IVacanciesProps } from './IVacanciesProps';
import SideBar from './layout/sidebar/Sidebar';
import CentreDisplay from './layout/center display/CentreDisplay';
import { NavigationProvider } from './context providers/NavigationContextProvider';
import TopNav from './layout/center display/TopNav';

export default class Vacancies extends React.Component<IVacanciesProps, {}> {
  public render(): React.ReactElement<IVacanciesProps> {
    const {
  
    } = this.props;

    return (
      <main className={styles.vacancies} style={{flexDirection:'row', height:'85vh', width:'100%', position:'relative', border:'solid 1px gray'}}>

        <NavigationProvider>

        <SideBar/>

        <CentreDisplay>
          <TopNav/>
          <div id='content-screen' style={{display:'flex', flexDirection:'column', height:'100%', width:'100%'}}>
          </div>
        </CentreDisplay>

        </NavigationProvider>
      </main>
    );
  }
}
