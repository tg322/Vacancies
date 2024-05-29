import { DocumentArrowUpRegular } from '@fluentui/react-icons';
import * as React from 'react';
import { useRef, useState } from 'react';
import styles from '../FileUpload.module.scss';
import { useVacancyContext } from '../../context providers/SingleVacancyContextProvider';
import { PreparedData } from '../../../utils/DataPrepares';
import { DataHandler } from '../../../utils/Helpers';
import FileSkeleton from './FileSkeleton';
import FileComponent from './FileComponent';

interface IFileUploadProps{
    context:any;
}

function FileUpload(props: IFileUploadProps){

    const[files, setFiles] = useState<FileList>();
    const inputFile = useRef<HTMLInputElement | null>(null);
    const[uploading, setUploading] = useState<boolean>(false);

    const dataPrepares = new PreparedData();
    const dataHandler = new DataHandler();

    const { singleVacancyState, singleVacancyDispatch } = useVacancyContext();

    function uploadFileClick(){
        if(inputFile.current){
            inputFile.current.click();
            console.log(inputFile.current.files);
        }
    }

    function onDragOver(event: React.DragEvent<HTMLLabelElement>){
        event.preventDefault();
        
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        
        
        let files = event.currentTarget.files;
        if(files && files.length > 0){
            setUploading(true);
            setFiles(files);
            if(files.length > 1){
                if(singleVacancyState.vacancy){
                    
                    await dataPrepares.addFileToVacancy(props.context, files, singleVacancyState.vacancy?.originalName);
                    const filesResponse = await dataPrepares.buildVacancyFiles(singleVacancyState.vacancy.vacancyEditLink, props.context);
                    singleVacancyDispatch({
                        type: 'APPEND_FILES_TO_VACANCY',
                        payload: {
                          vacancyId: singleVacancyState.vacancy.uniqueId,
                          files: filesResponse.data,
                        },
                      });
                      setUploading(false);
                }
                
            }else if(files.length === 1){
                if(singleVacancyState.vacancy){
                const file = files[0];
                await dataPrepares.addFileToVacancy(props.context, file, singleVacancyState.vacancy?.originalName);
                const filesResponse = await dataPrepares.buildVacancyFiles(singleVacancyState.vacancy.vacancyEditLink, props.context);
                singleVacancyDispatch({
                    type: 'APPEND_FILES_TO_VACANCY',
                    payload: {
                      vacancyId: singleVacancyState.vacancy.uniqueId,
                      files: filesResponse.data,
                    },
                  });

                  setUploading(false);
                }
            }
        }
    }

    async function handleDrop(event: React.DragEvent<HTMLLabelElement>){
            event.preventDefault();
            
            if(singleVacancyState.vacancy){
            if(event.dataTransfer.files.length > 1){
                setUploading(true);
                setFiles(event.dataTransfer.files);
                await dataPrepares.addFileToVacancy(props.context, event.dataTransfer.files, singleVacancyState.vacancy?.originalName);
                const filesResponse = await dataPrepares.buildVacancyFiles(singleVacancyState.vacancy.vacancyEditLink, props.context);

                singleVacancyDispatch({
                    type: 'APPEND_FILES_TO_VACANCY',
                    payload: {
                      vacancyId: singleVacancyState.vacancy.uniqueId,
                      files: filesResponse.data,
                    },
                  });

                setUploading(false);
            }else if(event.dataTransfer.files.length === 1){
                setUploading(true);
                setFiles(event.dataTransfer.files);
                await dataPrepares.addFileToVacancy(props.context, event.dataTransfer.files[0], singleVacancyState.vacancy?.originalName);
                const filesResponse = await dataPrepares.buildVacancyFiles(singleVacancyState.vacancy.vacancyEditLink, props.context);

                singleVacancyDispatch({
                    type: 'APPEND_FILES_TO_VACANCY',
                    payload: {
                      vacancyId: singleVacancyState.vacancy.uniqueId,
                      files: filesResponse.data,
                    },
                  });

                setUploading(false);
            }
        }
    }

    async function deleteFile(fileName:string){
        if(singleVacancyState.vacancy){
            try{
                await dataHandler.deleteFileFromSP(props.context, props.context.pageContext.web.absoluteUrl, `/sites/Staff/Recruitment/Applications/${singleVacancyState.vacancy?.originalName}`,fileName);
                const filesResponse = await dataPrepares.buildVacancyFiles(singleVacancyState.vacancy.vacancyEditLink, props.context);

                    singleVacancyDispatch({
                        type: 'APPEND_FILES_TO_VACANCY',
                        payload: {
                        vacancyId: singleVacancyState.vacancy.uniqueId,
                        files: filesResponse.data,
                        },
                    });

            }catch(error){
                console.log(error);
            }
        }
    }

    return(
        <div id='file-upload-container' className={styles['file-upload-container']}>
            <input
                    style={{display:'none'}}
                    ref={inputFile}
                    type="file"
                    className="inputFile"
                    accept="application/pdf"
                    name="file"
                    onClick={(e)=> {e.stopPropagation(); e.preventDefault}}
                    onChange={handleFileChange}
                />
            <div id='file-drop-zone-container' className={styles['file-drop-zone-container']}>
                <label id='file-drop-zone' className={styles['file-drop-zone']} onDragOver={onDragOver} onDrop={handleDrop}>
                    <div id='file-upload-drop-zone-info' className={styles['file-upload-drop-zone-info']}>
                        <DocumentArrowUpRegular fontSize={40}/>
                        <span>Drag and drop files or <span id='file-upload-upload-file-text' className={styles['file-upload-upload-file-text']} onClick={uploadFileClick}>click here to upload</span></span>
                    </div>
                </label>
                <div id='file-upload-details' className={styles['file-upload-details']}>
                    <span>Supported formats: .pdf</span>
                    <span>Max file size: 25MB</span>
                </div>
            </div>
            <div id='uploaded-files-container' className={styles['uploaded-files-container']} >
                <span>Files</span>
                <div id='uploaded-files-container-scroll-zone' className={styles['uploaded-files-container-scroll-zone']}>
                    {!uploading && singleVacancyState.vacancy?.fileData && singleVacancyState.vacancy?.fileData.map((file, key) => (
                        <FileComponent file={file} deleteFile={deleteFile} key={key}/>
                    ))}
                    {uploading && files && Object.keys(files).map((keyName, i) => (
                        <FileSkeleton key={i}/>
                    ))
                        
                    }
                </div>
            </div>
            
        </div>
    );
}

export default FileUpload