import '@/styles/index.scss';
import s from './layout.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { GlobalDocument } from '@/graphql';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { NextIntlClientProvider } from 'next-intl';
import { getPathname } from '@/i18n/routing';

export type LayoutProps = {
	children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
	return (
		<>
			<html lang='en'>
				<body id='root'>
					<NextIntlClientProvider>
						<main className={s.main}>{children}</main>
					</NextIntlClientProvider>
				</body>
			</html>
		</>
	);
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const {
		site: { globalSeo, faviconMetaTags },
	} = await apiQuery(GlobalDocument, {
		variables: { locale: locale as SiteLocale },
		revalidate: 60 * 60,
	});

	const siteName = globalSeo?.siteName ?? '';

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		...(await buildMetadata({
			title: {
				template: `${siteName} — %s`,
				default: siteName ?? '',
			},
			description: globalSeo?.fallbackSeo?.description?.substring(0, 157),
			pathname: getPathname({ locale, href: '/' }),
			image: globalSeo?.fallbackSeo?.image as FileField,
			locale,
		})),
	};
}

export type BuildMetadataProps = {
	title?: string | any;
	description?: string | null | undefined;
	pathname?: string;
	image?: FileField | null | undefined;
	locale: SiteLocale;
};

export async function buildMetadata({
	title,
	description,
	pathname,
	image,
	locale,
}: BuildMetadataProps): Promise<Metadata> {
	description = !description ? '' : description.length > 160 ? `${description.substring(0, 157)}...` : description;
	const url = pathname ? `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}` : undefined;

	return {
		title,
		alternates: {
			canonical: url,
		},
		description,
		openGraph: {
			title,
			description,
			url,
			images: image
				? [
						{
							url: `${image?.url}?w=1200&h=630&fit=fill&q=80`,
							width: 800,
							height: 600,
							alt: title,
						},
						{
							url: `${image?.url}?w=1600&h=800&fit=fill&q=80`,
							width: 1600,
							height: 800,
							alt: title,
						},
						{
							url: `${image?.url}?w=790&h=627&fit=crop&q=80`,
							width: 790,
							height: 627,
							alt: title,
						},
				  ]
				: undefined,
			locale: locale === 'sv' ? 'sv_SE' : 'en_US',
			type: 'website',
		},
	};
}
