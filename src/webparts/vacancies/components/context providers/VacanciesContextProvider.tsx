// NavigationContextProvider.tsx
import * as React from 'react';
import { createContext, useContext, useReducer } from 'react';
import { IVacancyProps } from '../Vacancies/IVacancyProps';

//Define the interface for the useReducer, this is the state value so whatever you intend to put inside it will be the type, using a string array here.

interface VacanciesState {
  vacancies: IVacancyProps[];
}

//The actions to be run, this still confuses me.

type Action =
  | { type: 'ADD_TO_VACANCIES'; payload: IVacancyProps }
  | { type: 'REMOVE_FROM_VACANCIES'; payload: IVacancyProps }
  | { type: 'RESET_VACANCIES'; };

const initialState: VacanciesState = { vacancies: [] };


//Create the reducer function (I hate all the const functions wtf is this all about.)
const navigationReducer = (state: VacanciesState, action: Action): VacanciesState => {

//Switch statement for actions and their... actions?
    switch (action.type) {
        case 'ADD_TO_VACANCIES':
            return { ...state, vacancies: [...state.vacancies, action.payload] };
        case 'REMOVE_FROM_VACANCIES':
            return { ...state, vacancies: state.vacancies.filter((item) => item !== action.payload) };
        case 'RESET_VACANCIES':
            return { ...state, vacancies: [] };
        default:
            return state;
    }
};

//Create the context function (Another one...)
const VacanciesContext = createContext<{
    state: VacanciesState;
    dispatch: React.Dispatch<Action>;
  } | undefined>(undefined);
  
//Create the context instance

  export const useVacanciesContext = () => {
    const context = useContext(VacanciesContext);
    if (!context) {
      throw new Error('useVacanciesContext must be used within a VacanciesProvider');
    }
    return context;
  };

  //Interface to give children a type of ReactNode (A JSX component) as any will cause sticky bugs later down the line.
  
  interface VacanciesProviderProps {
    children: React.ReactNode;
  }

  //Create the localised context wrapper (All components wrapped by this component can access the context.)
  export const VacanciesProvider: React.FC<VacanciesProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(navigationReducer, initialState);
  
    return (
      <VacanciesContext.Provider value={{ state, dispatch }}>
        {children}
      </VacanciesContext.Provider>
    );
  };
  