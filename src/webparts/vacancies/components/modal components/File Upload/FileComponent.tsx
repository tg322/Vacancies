import * as React from 'react';
import styles from '../FileUpload.module.scss';
import { DismissRegular, DocumentPdfRegular } from '@fluentui/react-icons';
import { IFileDataProps } from '../../Vacancies/IVacancyProps';

interface IFileComponentProps{
    file:IFileDataProps;
    deleteFile(fileName:string): void;
}

function FileComponent(props: IFileComponentProps){

    return(
        <div id='uploaded-file-component' className={styles['uploaded-file-component']}>
            <div id='uploaded-file-content-container' className={styles['uploaded-file-content-container']}>
                <div id='uploaded-file-name-container' className={styles['uploaded-file-name-container']}>
                <DocumentPdfRegular fontSize={30} style={{marginRight:'10px'}}/>
                <a id='uploaded-file-name-wrapper' className={styles['uploaded-file-name-wrapper']} href={window.location.origin + props.file.serverRelativeUrl} target='_blank'>
                    <span>{props.file.name.slice(0, props.file.name.lastIndexOf('.'))}</span>
                </a>
                <span style={{marginLeft:'5px'}}>{props.file.name.slice(props.file.name.lastIndexOf('.'))}</span>
                </div>
                <div id='uploaded-file-delete-button' className={styles['uploaded-file-delete-button']} onClick={() => props.deleteFile(props.file.name)}>
                    <DismissRegular fontSize={20}/>
                </div>
            </div>
        </div>
    );
}

export default FileComponent