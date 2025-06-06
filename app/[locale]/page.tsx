import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDatoCmsConfig } from 'next-dato-utils/config';

export type PageProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function Home({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('Start');
	const config = await getDatoCmsConfig();
	return (
		<div>
			{locale} {JSON.stringify(config)}
		</div>
	);
}
