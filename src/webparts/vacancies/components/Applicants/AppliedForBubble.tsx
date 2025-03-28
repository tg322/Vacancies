import * as React from 'react';

interface IAppliedForProps{
    vacancyName: string;
    color: string;
    bgColor: string;
}

function AppliedForBubble(props: IAppliedForProps){

    
    return(
        <div style={{padding:'3px 8px', backgroundColor:`${props.bgColor}`, borderRadius:'100px', color:`${props.color}`, display:'flex', maxWidth:'150px', boxSizing:'border-box', overflow:'hidden', width:'fit-content', height:'fit-content'}}>
            <span style={{textOverflow:'ellipsis', overflow:'hidden', textWrap:'nowrap', fontSize:'12px'}}>{props.vacancyName}</span>
        </div>
    );
}
export default AppliedForBubble