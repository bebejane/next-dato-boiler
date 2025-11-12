import s from './page.module.scss';
import { AllPostsDocument, StartDocument } from '@/graphql';
import { Link } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default async function Home({ params }: PageProps<'/[locale]'>) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	console.log(locale);
	setRequestLocale(locale);

	const { start, draftUrl } = await apiQuery(StartDocument, {
		variables: { locale: locale as SiteLocale },
	});
	const { allPosts } = await apiQuery(AllPostsDocument, {
		variables: { locale: locale as SiteLocale },
		tags: ['color'],
	});

	if (!start) return notFound();

	return (
		<>
			<article className={s.article}>
				<h1>{start.headline}</h1>
				<ul>
					{allPosts.map((post, idx) => (
						<li key={idx}>
							<Link
								locale={locale}
								href={{
									pathname: '/posts/[post]',
									params: { post: post.slug as string },
								}}
							>
								<div className={s.color} style={{ backgroundColor: post.color?.color?.hex }}></div> {post.title}
							</Link>
						</li>
					))}
				</ul>
			</article>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}

export async function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}
