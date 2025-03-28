import * as React from 'react';
import styles from '../File Upload/FileUpload.module.scss';

function FileSkeleton(){

    return(
        <div className={styles['skeleton-uploaded-file-component']}>
            <div className={styles['skeleton-uploaded-file-content-container']}>
                <div className={styles['skeleton-uploaded-file-name-container']}>
                    <div className={styles['skeleton-content']}></div>
                </div>
            </div>
        </div>
    );
}

export default FileSkeleton