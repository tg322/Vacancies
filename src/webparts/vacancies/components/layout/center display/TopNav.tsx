import * as React from 'react';
import { useNavigationContext } from '../../context providers/NavigationContextProvider';

function TopNav(){

    const { state, dispatch } = useNavigationContext();

    

    return(
        <div id='nav' style={{display:'flex', flexDirection:'row', height:'54px', width:'100%', boxSizing:'border-box', padding:'10px', alignItems:'center', gap:'20px'}}>
            
            {state.path && state.path.map((path, key) => { 
                
                //if path is no the last item and not the first
                if(key != state.path.length -1){
                    return(<h3 style={{margin:'0px', fontWeight:'600', cursor:'pointer', userSelect:'none'}} key={key} onClick={() => dispatch({ type: 'CHANGE_PATH', payload: key +1 })}>{path}</h3>);
                }else{
                    let pathName = path;
                    if(pathName.indexOf('-') != -1){
                        pathName = pathName.slice(0, pathName.indexOf('-'));
                    }
                    return(<h3 style={{margin:'0px', fontWeight:'600', userSelect:'none'}} key={key}>{pathName}</h3>);
                }
                
                
            })}
        </div>
    );

}

export default TopNav