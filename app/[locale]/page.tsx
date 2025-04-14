import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations } from 'next-intl/server';

export type PageProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function Home({ params }: PageProps) {
	const { locale } = await params;
	const t = await getTranslations('Start');

	return <>{locale}</>;
}
