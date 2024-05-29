
import { Button, Checkbox, CheckboxOnChangeData, CheckboxProps, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTrigger, Field, Input, Label } from '@fluentui/react-components';
import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useVacancyContext } from '../context providers/SingleVacancyContextProvider';
import { DatePicker } from '@fluentui/react';
import FileUpload from '../modal components/File Upload/FileUpload';
import { PreparedData } from '../../utils/DataPrepares';
import { DataHandler } from '../../utils/Helpers';

interface IEditVacancyModalProps{
    openDialog: boolean;
    closeDialog: ()=> void;
    context:any;
    selectedVacancyKey:number;
    submitDialog: () => void;
}

type VacancyUpdates = Partial<{
    name: string;
    originalName: string;
    archived: boolean;
    closingDate: Date;
    formattedClosingDate: string;
  }>;

function EditVacancyModal(props:IEditVacancyModalProps, checkBoxProps: CheckboxProps){
    const { singleVacancyState, singleVacancyDispatch } = useVacancyContext();
    const[vacancyName, setVacancyName] = useState<string>('');
    const [selectedDate, setSelectedDate] = React.useState<
    Date | null | undefined
    >(null);
    const[triggerSubmit, setTriggerSubmit] = useState<boolean>(false);

    const preparedData = new PreparedData();

    const dataHandler = new DataHandler();

    const[archiveVacancyState, setArchiveVacancy] = useState<boolean>(false);

    useEffect(() => {
        if (singleVacancyState.vacancy) {
          setVacancyName(singleVacancyState.vacancy.name);
          setSelectedDate(singleVacancyState.vacancy.closingDate);
          setArchiveVacancy(singleVacancyState.vacancy.archived);
        }
    }, [singleVacancyState]);

    useEffect(  () => {
        if(triggerSubmit){
            props.submitDialog();
            setTriggerSubmit(false);
        }
        
    }, [triggerSubmit]);

    function onChangeVacancyName(ev: React.FormEvent<HTMLInputElement>, data: { value: string }){
        setVacancyName(data.value);
    }

    function archiveVacancy(ev: ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData){  
        setArchiveVacancy(!archiveVacancyState);
    }

    async function onBeforeSubmitDialog() {
        if (singleVacancyState.vacancy) {
            //api calls
            const updates: VacancyUpdates = {};
    
            if (vacancyName && vacancyName !== singleVacancyState.vacancy.name) {
                updates.name = vacancyName;
                updates.originalName = vacancyName + singleVacancyState.vacancy.originalName.slice(singleVacancyState.vacancy.originalName.indexOf('-'));
                try{
                    const response = await dataHandler.updateListItem(props.context, `/sites/Staff/Recruitment/Applications/${singleVacancyState.vacancy.originalName}`, 'FileLeafRef', vacancyName + singleVacancyState.vacancy.originalName.slice(singleVacancyState.vacancy.originalName.indexOf('-')));

                    console.log(response);
                }catch(error){
                    console.log(error)
                }
            }
    
            if (archiveVacancyState !== undefined && archiveVacancyState !== singleVacancyState.vacancy.archived) {
                updates.archived = archiveVacancyState;
                try{
                    const response = await dataHandler.updateListItem(props.context, `/sites/Staff/Recruitment/Applications/${singleVacancyState.vacancy.originalName}`, 'Archive', archiveVacancyState);

                    console.log(response);
                }catch(error){
                    console.log(error)
                }
            }
    
            if (selectedDate && selectedDate !== singleVacancyState.vacancy.closingDate) {
                updates.closingDate = selectedDate;
                updates.formattedClosingDate = preparedData.formatDate(selectedDate);
                try{
                    const response = await dataHandler.updateListItem(props.context, `/sites/Staff/Recruitment/Applications/${singleVacancyState.vacancy.originalName}`, 'ClosingDate', selectedDate);

                    console.log(response);
                }catch(error){
                    console.log(error)
                }
            }
    
            if (Object.keys(updates).length > 0) {
                singleVacancyDispatch({
                    type: 'CHANGE_VACANCY_FIELDS_STATE',
                    payload: {
                        vacancyUniqueId: singleVacancyState.vacancy.uniqueId,
                        updates,
                    },
                });
            }

            setTriggerSubmit(true);
            
        }
        
    }

    return(
        <Dialog open={props.openDialog}>
            <DialogSurface>
                <DialogBody>
                    <DialogContent style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                            <div style={{display:'flex', flexDirection:'column'}}>
                                <Label id={"vacancy-name-input"}>
                                  Vacancy Name
                                </Label>
                                <Input type="text" id={"vacancy-name-input"} value={vacancyName} onChange={onChangeVacancyName}/>
                            </div>
                            <div style={{display:'flex', flexDirection:'column'}}>
                                <Field label="Closing Date">
                                    <DatePicker
                                        placeholder="Closing Date"
                                        onSelectDate={setSelectedDate}
                                        value={selectedDate? selectedDate : new Date()}
                                    />
                                </Field>
                            </div>
                        </div>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <FileUpload context={props.context} />
                        </div>
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <Checkbox {...checkBoxProps} onChange={archiveVacancy} checked={archiveVacancyState} label='Archive Vacancy?'/>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                        <Button appearance="secondary" onClick={() => props.closeDialog()}>Close</Button>
                        </DialogTrigger>
                        <Button type="submit" appearance="primary" onClick={onBeforeSubmitDialog}>
                        Submit
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}

export default EditVacancyModal