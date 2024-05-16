import * as React from 'react';
import { useNavigationContext } from '../../context providers/NavigationContextProvider';

function TopNav(){

    const { path } = useNavigationContext();

    console.log(path);

    return(
        <div id='nav' style={{display:'flex', flexDirection:'row', height:'60px', width:'100%', boxSizing:'border-box', padding:'10px', alignItems:'center'}}>
            <h3 style={{margin:'0px', fontWeight:'600'}}>{path}</h3>
        </div>
    );

}

export default TopNav