import { Button, CheckboxProps, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTrigger, Field, Input, Label } from '@fluentui/react-components';
import * as React from 'react';
import { useEffect, useState } from 'react';
// import { useVacancyContext } from '../context providers/SingleVacancyContextProvider';
import { DatePicker } from '@fluentui/react';
import FileUpload from '../modal components/File Upload/FileUpload';
// import { PreparedData } from '../../utils/DataPrepares';
// import { DataHandler } from '../../utils/Helpers';

interface INewVacancyModalProps{
    openDialog: boolean;
    closeDialog: ()=> void;
    context:any;
    submitDialog: () => void;
}

// type VacancyUpdates = Partial<{
//     name: string;
//     originalName: string;
//     archived: boolean;
//     closingDate: Date;
//     formattedClosingDate: string;
//   }>;

function NewVacancyModal(props:INewVacancyModalProps, checkBoxProps: CheckboxProps){
    // const { singleVacancyState, singleVacancyDispatch } = useVacancyContext();
    const[vacancyName, setVacancyName] = useState<string>('');
    const [selectedDate, setSelectedDate] = React.useState<
    Date | null | undefined
    >(null);
    const[triggerSubmit, setTriggerSubmit] = useState<boolean>(false);

    // const preparedData = new PreparedData();

    // const dataHandler = new DataHandler();

    useEffect(  () => {
        if(triggerSubmit){
            props.submitDialog();
            setTriggerSubmit(false);
        }
        
    }, [triggerSubmit]);

    function onChangeVacancyName(ev: React.FormEvent<HTMLInputElement>, data: { value: string }){
        setVacancyName(data.value);
    }

    async function onBeforeSubmitDialog() {

            setTriggerSubmit(true);
            
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

export default NewVacancyModal