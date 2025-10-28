import { AllPostsDocument, StartDocument } from '@/graphql';
import { Link } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export type PageProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function Home({ params }: PageProps) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();

	setRequestLocale(locale);

	const { start, draftUrl } = await apiQuery(StartDocument, { variables: { locale: locale as SiteLocale } });
	const { allPosts } = await apiQuery(AllPostsDocument, { variables: { locale: locale as SiteLocale } });

	if (!start) return notFound();

	return (
		<>
			<article>
				<h1>{start.headline}</h1>
				<ul>
					{allPosts.map((post) => (
						<li key={post.slug}>
							<Link
								locale={locale}
								href={{
									pathname: '/posts/[post]',
									params: { post: post.slug },
								}}
							>
								{post.title}
							</Link>
						</li>
					))}
				</ul>
			</article>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
