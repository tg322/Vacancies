// MyContext.tsx
import * as React from 'react';
import { createContext, useContext, useState } from 'react';

// Define the shape of the context data
interface NavigationContextProps {
  path: Array<string>;
  addToPath: (pathToAdd: string) => void;
  removeFromPath: (pathToRemove: string) => void;
  resetPath: () => void;
}

// Create the context with default values
const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

// Create a custom hook to use the MyContext
export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};

// Define the provider's props
interface NavigationProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [path, setPath] = useState<Array<string>>([]);

  function addToPath(pathToAdd:string){
    setPath([...path, pathToAdd]);
  }

  function removeFromPath(pathToRemove:string){
    setPath((prevPath) => prevPath.filter((i) => i !== pathToRemove));
  }

  function resetPath(){
    setPath([]);
  }

  return (
    <NavigationContext.Provider value={{ path, addToPath, removeFromPath, resetPath }}>
      {children}
    </NavigationContext.Provider>
  );
};