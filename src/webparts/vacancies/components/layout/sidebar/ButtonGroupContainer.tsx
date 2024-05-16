import { useNavigationContext } from "../../context providers/NavigationContextProvider";
import { IButtonGroupContainerProps, IButtonProps } from "./ISideBarInterfaces";
import styles from './SideBar.module.scss';
import * as React from 'react';

function SideBarButton(props: IButtonGroupContainerProps){

    const { path } = useNavigationContext();

    return(
        <div id='button-group' className={styles.buttonGroup}>
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement<IButtonProps>(child)) {
                    return React.cloneElement(child, {
                        isActive: path.indexOf(child.props.id) != -1,
                    });
                }
                return child;
            })}
        </div>
    );
}

export default SideBarButton