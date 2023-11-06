'use server'

import '@styles/index.scss'
import { NavBar } from '@components';
import { apiQuery } from '@lib/client';
import { GlobalDocument } from '@graphql';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { RouteChange } from '@components';

export type LayoutProps = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: LayoutProps) {

  return (
    <>
      <html lang="en">
        <body id="root" >
          <NavBar />
          <main>
            {children}
          </main>
        </body>
      </html >
      <RouteChange />
    </>
  );
}

export async function generateMetadata() {
  const { site: { globalSeo, favicon } } = await apiQuery<GlobalQuery, GlobalQueryVariables>(GlobalDocument, { generateTags: false });
  return {
    title: globalSeo?.siteName,
    description: globalSeo?.fallbackSeo?.description,
    image: globalSeo?.fallbackSeo?.image?.url,
    icons: favicon.map(({ attributes: { rel, sizes, type, href: url } }) => ({ rel, url, sizes, type })) as Icon[],
  } as Metadata
}
