import { useContext, createContext } from "react";

export type PageProps = {
  layout: 'normal' | 'full',
  menu: 'normal' | 'inverted',
  color: string,
  sidebar:boolean,
  footerLine?:boolean
}

const initialState : PageProps = {
  layout: 'normal',
  menu: 'normal',
  color: '--white',
  sidebar: true,
  footerLine:false
}

export const PageContext = createContext(initialState);

export type PageProviderProps = {
  children: React.ReactElement,
  value: PageProps
}

// Context provider
export const PageProvider = ({ children, value } : PageProviderProps) => {
  
  return (
    <PageContext.Provider value={{...initialState, ...value, color:`rgba(var(${value.color}),1)`}}>
      {children}
    </PageContext.Provider>
  )
};
// usePage hook
export const usePage = () : PageProps => {
  return useContext(PageContext)
}
