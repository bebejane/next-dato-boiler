import s from './layout.module.scss'
import { use } from 'react';
import { apiQuery } from '/lib/api';
import { AllPostsDocument } from '/graphql';
//import { DatoMarkdown } from 'dato-nextjs-utils/components';

export type LayoutProps = { 
  children: React.ReactNode
}

export const revalidate = 60;

export default async function RootLayout({ children } : LayoutProps) {

  const data = await apiQuery(AllPostsDocument, {})
  console.log(data)
  const posts = []
  return (
    <html lang="en">
      <head>
        <title>Boiler</title>
      </head>
      <body>
        <nav>
          <ul className={s.nav}>
            {posts.map((p, key) => 
              <li key={key}>{p.title}</li>
            )}
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}

