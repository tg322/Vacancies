import * as React from 'react';
import styles from './CenterDisplay.module.scss';
import { ICentreDisplayProps } from './ICentreDisplayInterfaces';

function CentreDisplay(props:ICentreDisplayProps){

    return(
        <div id='center-display' className={styles.centreDisplay}>
            {props.children}
        </div>
    );
}

export default CentreDisplay