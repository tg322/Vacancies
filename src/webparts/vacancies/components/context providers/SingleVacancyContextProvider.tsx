// NavigationContextProvider.tsx
import * as React from 'react';
import { createContext, useContext, useReducer } from 'react';
import { IFileDataProps, IVacancyProps } from '../Vacancies/IVacancyProps';

//Define the interface for the useReducer, this is the state value so whatever you intend to put inside it will be the type, using a string array here.

interface VacancyState {
  vacancy?: IVacancyProps;
}

type VacancyUpdates = Partial<{
  name: string;
  originalName: string;
  archive: boolean;
  closingDate: Date;
  formattedClosingDate: string;
}>;

// Define the actions for the reducer
type Action =
  | { type: 'ADD_TO_VACANCY'; payload: IVacancyProps }
  | { type: 'RESET_VACANCY' }
  | { type: 'APPEND_FILES_TO_VACANCY'; payload: { vacancyId: number, files: IFileDataProps[] } }
  | { type: 'CHANGE_VACANCY_FIELDS_STATE'; payload: { vacancyUniqueId: number, updates: VacancyUpdates } };

  

// Set the initial state
const initialState: VacancyState = { vacancy: undefined };

// Create the reducer function
const singleVacancyReducer = (singleVacancyState: VacancyState, action: Action): VacancyState => {
  switch (action.type) {
    case 'ADD_TO_VACANCY':
      return { ...singleVacancyState, vacancy: action.payload };
    case 'RESET_VACANCY':
      return { ...singleVacancyState, vacancy: undefined };
    case 'APPEND_FILES_TO_VACANCY':
      // Destructure the payload to get vacancyId and files
      const { vacancyId, files } = action.payload;

      // Check if the current state's vacancy matches the vacancyId in the payload
      if (singleVacancyState.vacancy?.uniqueId === vacancyId) {
        // Append the new files to the fileData array
        const updatedFileData = files;

        // Return the new state with the updated fileData array
        return {
          ...singleVacancyState,
          vacancy: {
            ...singleVacancyState.vacancy,
            fileData: updatedFileData
          }
        };
      }

      // If the vacancyId doesn't match, return the current state unchanged
      return singleVacancyState;

      case 'CHANGE_VACANCY_FIELDS_STATE':
        const { vacancyUniqueId, updates } = action.payload;
        if (singleVacancyState.vacancy?.uniqueId === vacancyUniqueId) {
          return {
            ...singleVacancyState,
            vacancy: {
              ...singleVacancyState.vacancy,
              ...updates,
            },
          };
        }
        return singleVacancyState;
      default:
        return singleVacancyState;
    }
  };

//Create the context function (Another one...)
const VacancyContext = createContext<{
    singleVacancyState: VacancyState;
    singleVacancyDispatch: React.Dispatch<Action>;
  } | undefined>(undefined);
  
//Create the context instance

  export const useVacancyContext = () => {
    const context = useContext(VacancyContext);
    if (!context) {
      throw new Error('useVacanciesContext must be used within a VacanciesProvider');
    }
    return context;
  };

  //Interface to give children a type of ReactNode (A JSX component) as any will cause sticky bugs later down the line.
  
  interface VacancyProviderProps {
    children: React.ReactNode;
  }

  //Create the localised context wrapper (All components wrapped by this component can access the context.)
  export const VacancyProvider: React.FC<VacancyProviderProps> = ({ children }) => {
    const [singleVacancyState, singleVacancyDispatch] = useReducer(singleVacancyReducer, initialState);
  
    return (
      <VacancyContext.Provider value={{ singleVacancyState, singleVacancyDispatch }}>
        {children}
      </VacancyContext.Provider>
    );
  };
  