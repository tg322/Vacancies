// NavigationContextProvider.tsx
import * as React from 'react';
import { createContext, useContext, useReducer } from 'react';
import { IApplicantProps } from '../Applicants/IApplicantProps';


//Define the interface for the useReducer, this is the state value so whatever you intend to put inside it will be the type, using a string array here.

interface ApplicantsState {
  applicants: IApplicantProps[];
}

//The actions to be run, this still confuses me.

type Action =
  | { type: 'ADD_TO_APPLICANTS'; payload: IApplicantProps }
  | { type: 'BULK_ADD_TO_APPLICANTS'; payload: IApplicantProps[] }
  | { type: 'REMOVE_FROM_APPLICANTS'; payload: IApplicantProps }
  | { type: 'RESET_APPLICANTS'; }
  | { type: 'REPLACE_APPLICANT'; payload: IApplicantProps };

const initialState: ApplicantsState = { applicants: [] };


//Create the reducer function (I hate all the const functions wtf is this all about.)
const navigationReducer = (applicantState: ApplicantsState, action: Action): ApplicantsState => {

//Switch statement for actions and their... actions?
    switch (action.type) {
        case 'ADD_TO_APPLICANTS':
            return { ...applicantState, applicants: [...applicantState.applicants, action.payload] };
        case 'BULK_ADD_TO_APPLICANTS':
          return { ...applicantState, applicants: [...action.payload] };
        case 'REMOVE_FROM_APPLICANTS':
            return { ...applicantState, applicants: applicantState.applicants.filter((item) => item !== action.payload) };
        case 'RESET_APPLICANTS':
            return { ...applicantState, applicants: [] };
        case 'REPLACE_APPLICANT':
          return {
            ...applicantState,
            applicants: applicantState.applicants.map(applicant =>
              applicant.uniqueId === action.payload.uniqueId ? action.payload : applicant
            ),
          };
        default:
            return applicantState;
    }
};

//Create the context function (Another one...)
const ApplicantsContext = createContext<{
    applicantState: ApplicantsState;
    applicantDispatch: React.Dispatch<Action>;
  } | undefined>(undefined);
  
//Create the context instance

  export const useApplicantsContext = () => {
    const context = useContext(ApplicantsContext);
    if (!context) {
      throw new Error('useApplicantsContext must be used within a ApplicantsProvider');
    }
    return context;
  };

  //Interface to give children a type of ReactNode (A JSX component) as any will cause sticky bugs later down the line.
  
  interface ApplicantsProviderProps {
    children: React.ReactNode;
  }

  //Create the localised context wrapper (All components wrapped by this component can access the context.)
  export const ApplicantsProvider: React.FC<ApplicantsProviderProps> = ({ children }) => {
    const [applicantState, applicantDispatch] = useReducer(navigationReducer, initialState);
  
    return (
      <ApplicantsContext.Provider value={{ applicantState, applicantDispatch }}>
        {children}
      </ApplicantsContext.Provider>
    );
  };
  