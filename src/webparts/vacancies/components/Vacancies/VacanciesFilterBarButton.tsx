import * as React from 'react';

interface IVacancyFilterBarButtonProps{
    title: string;
    total: number;
    selected: number;
    onSelect: (key:number) => void;
    itemKey: number;
    bgColor: string;
    txtColor: string;
}

function VacanciesFilterBarButton(props: IVacancyFilterBarButtonProps){

    return(
        <div id='vacancy-filter-button-container' style={{display:'flex', flexDirection:'row', alignItems:'center', alignSelf:'center', gap:'10px', fontWeight:'600', borderBottom: props.selected === props.itemKey ? '2px solid #000f5b' : 'none', boxSizing:'border-box', paddingBottom:props.selected === props.itemKey ? '6px' : '8px', cursor:'pointer'}} onClick={() => props.onSelect(props.itemKey)}>
            <span id='vacancy-filter-button-title' style={{fontSize:'16px', fontWeight:'600', color: props.selected === props.itemKey ? 'inherit' : '#a8a8a8'}}>{props.title}</span>
            <div id='vacancy-filter-button-award-container' style={{display:'flex', width:'25px', height:'25px', backgroundColor:`${props.bgColor}`, borderRadius:'8px', justifyContent:'center', alignItems:'center', color:`${props.txtColor}`}}>
                <span id='vacancy-filter-button-total'>{props.total}</span>
            </div>
        </div>
    );
}

export default VacanciesFilterBarButton