import { useNavigationContext } from "../../context providers/NavigationContextProvider";
import { IButtonProps } from "./ISideBarInterfaces";
import styles from './SideBar.module.scss';
import * as React from 'react';

function SideBarButton(props: IButtonProps){

    const {path, resetPath, addToPath } = useNavigationContext();

    function handlePaths(){
        resetPath();
        addToPath(props.id);
    }

    return(
        <div className={ `${props.isActive ? styles.buttonContainerClicked : styles.buttonContainer}`} onClick={() => handlePaths() }>
            {props.icon}
            <span style={{fontWeight:'600', margin:'0px', height:'fit-content', userSelect:'none'}}>{props.title}</span>
        </div>
    );
}

export default SideBarButton