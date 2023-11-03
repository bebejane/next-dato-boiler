import { useContext, createContext } from "react";

type PageProps = {
  isHome: boolean
}

const initialState: PageProps = {
  isHome: true
}

export const PageContext = createContext(initialState);

export type PageProviderProps = {
  children: React.ReactElement | React.ReactElement[]
  value: PageProps
}

// Context provider
export const PageProvider = ({ children, value }: PageProviderProps) => {

  return (
    <PageContext.Provider value={{
      ...initialState,
      ...value
    }}>
      {children}
    </PageContext.Provider>
  )
};
// usePage hook
export const usePage = (): PageProps => {
  return useContext(PageContext)
}
