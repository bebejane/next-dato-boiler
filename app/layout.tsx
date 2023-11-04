import '@styles/index.scss'
import { DraftMode } from '@components';
import { apiQuery } from '@lib/client';
import { GlobalDocument } from '@graphql';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';

export type LayoutProps = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: LayoutProps) {
  console.log('hej')
  return (
    <html lang="en">
      <body id="root" >
        {children}
        <DraftMode draftMode={false} />
      </body>
    </html >
  );
}

export async function generateMetadata() {
  const { site: { globalSeo, favicon } } = await apiQuery<GlobalQuery>(GlobalDocument, { generateTags: false });
  return {
    title: globalSeo?.siteName,
    description: globalSeo?.fallbackSeo?.description,
    image: globalSeo?.fallbackSeo?.image?.url,
    icons: favicon.map(({ attributes: { rel, sizes, type, href: url } }) => ({ rel, url, sizes, type })) as Icon[],
  } as Metadata
}
