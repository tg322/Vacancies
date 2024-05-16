
export interface IButtonProps{
    title:string;
    icon:React.ReactNode;
    isActive?:boolean;
    id:string;
    onClick?: (id: string) => void;
}

export interface IButtonGroupContainerProps{
    children: React.ReactNode;
}