import s from './layout.module.scss'
import { apiQuery } from 'dato-nextjs-utils/api';
import { DatoMarkdown } from 'dato-nextjs-utils/components';

import { AllPostsDocument } from '../lib/graphql';
import { useEffect } from 'react';

export type LayoutProps = { 
  children: React.ReactNode
}

//export const revalidate = 60;

export default function RootLayout({ children } : LayoutProps) {

  useEffect(()=>{
    apiQuery(AllPostsDocument).then(r => console.log(r)).catch(err => console.log(err))
    
  }, [])
  
  
  return (
    
    <DatoMarkdown>hej</DatoMarkdown>
  );
}

