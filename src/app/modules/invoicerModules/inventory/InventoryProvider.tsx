import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface InventoryContextProps {
  shouldFetchInventory: boolean;
  setShouldFetchInventory: Dispatch<SetStateAction<boolean>>;
  shouldFetchInvoice: boolean;
  setShouldFetchInvoice: Dispatch<SetStateAction<boolean>>;
  shouldFetchOrganisation: boolean;
  setShouldFetchOrganisation: Dispatch<SetStateAction<boolean>>
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [shouldFetchInventory, setShouldFetchInventory] = useState<boolean>(false);
  const [shouldFetchInvoice, setShouldFetchInvoice] = useState<boolean>(false);
  const [shouldFetchOrganisation, setShouldFetchOrganisation] = useState<boolean>(false);

  const value: InventoryContextProps = {
    shouldFetchInventory,
    setShouldFetchInventory,
    shouldFetchInvoice,
    setShouldFetchInvoice,
    shouldFetchOrganisation,
    setShouldFetchOrganisation
    
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};