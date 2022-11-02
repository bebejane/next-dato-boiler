import s from './layout.module.scss'
import Navbar from '/app/Navbar';
import { Suspense } from "react";
import Loading from './loading';

export type LayoutProps = { 
  children: React.ReactNode
}

export const revalidate = 30000;

export default async function RootLayout({ children } : LayoutProps) {

  console.log('layout load')

  return (
    <html lang="en">
      <head>
        <title>Boiler</title>
      </head>
      <body>
        <Suspense fallback={<Loading/>}>
          <Navbar/>
        </Suspense>
        {children}
        
      </body>
    </html>
  );
}

