import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

interface CombinedContextProps {
  shouldFetchVendor: boolean
  setShouldFetchVendor: Dispatch<SetStateAction<boolean>>
  shouldFetchInventory: boolean
  setShouldFetchInventory: Dispatch<SetStateAction<boolean>>
  shouldFetchInvoice: boolean
  setShouldFetchInvoice: Dispatch<SetStateAction<boolean>>
  shouldFetchOrganisation: boolean
  setShouldFetchOrganisation: Dispatch<SetStateAction<boolean>>
}

const CombinedContext = createContext<CombinedContextProps | undefined>(undefined)

export const useCombinedContext = () => {
  const context = useContext(CombinedContext)
  if (!context) {
    throw new Error('useCombinedContext must be used within a CombinedProvider')
  }
  return context
}

interface CombinedProviderProps {
  children: ReactNode
}

export const CombinedProvider: React.FC<CombinedProviderProps> = ({children}) => {
  const [shouldFetchVendor, setShouldFetchVendor] = useState<boolean>(false)
  const [shouldFetchInventory, setShouldFetchInventory] = useState<boolean>(false)
  const [shouldFetchInvoice, setShouldFetchInvoice] = useState<boolean>(false)
  const [shouldFetchOrganisation, setShouldFetchOrganisation] = useState<boolean>(false)

  const value: CombinedContextProps = {
    shouldFetchVendor,
    setShouldFetchVendor,
    shouldFetchInventory,
    setShouldFetchInventory,
    shouldFetchInvoice,
    setShouldFetchInvoice,
    shouldFetchOrganisation,
    setShouldFetchOrganisation,
  }

  return <CombinedContext.Provider value={value}>{children}</CombinedContext.Provider>
}
