// NavigationContextProvider.tsx
import * as React from 'react';
import { createContext, useContext, useReducer } from 'react';

//Define the interface for the useReducer, this is the state value so whatever you intend to put inside it will be the type, using a string array here.

interface NavigationState {
  path: string[];
}

//The actions to be run, this still confuses me.

type Action =
  | { type: 'ADD_TO_PATH'; payload: string }
  | { type: 'REMOVE_FROM_PATH'; payload: string }
  | { type: 'RESET_AND_ADD_TO_PATH'; payload: string }
  | { type: 'CHANGE_PATH'; payload: number }

const initialState: NavigationState = { path: ['Vacancies'] };


//Create the reducer function (I hate all the const functions wtf is this all about.)
const navigationReducer = (state: NavigationState, action: Action): NavigationState => {

//Switch statement for actions and their... actions?
    switch (action.type) {
        case 'ADD_TO_PATH':
            return { ...state, path: [...state.path, action.payload] };
        case 'REMOVE_FROM_PATH':
            return { ...state, path: state.path.filter((item) => item !== action.payload) };
        case 'RESET_AND_ADD_TO_PATH':
            return { ...state, path: [action.payload] };
        case 'CHANGE_PATH':
            return { ...state, path: state.path.splice(0, action.payload)  };
        default:
            return state;
    }
};

//Create the context function (Another one...)
const NavigationContext = createContext<{
    state: NavigationState;
    dispatch: React.Dispatch<Action>;
  } | undefined>(undefined);
  
//Create the context instance

  export const useNavigationContext = () => {
    const context = useContext(NavigationContext);
    if (!context) {
      throw new Error('useNavigationContext must be used within a NavigationProvider');
    }
    return context;
  };

  //Interface to give children a type of ReactNode (A JSX component) as any will cause sticky bugs later down the line.
  
  interface NavigationProviderProps {
    children: React.ReactNode;
  }

  //Create the localised context wrapper (All components wrapped by this component can access the context.)
  export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(navigationReducer, initialState);
  
    return (
      <NavigationContext.Provider value={{ state, dispatch }}>
        {children}
      </NavigationContext.Provider>
    );
  };
  