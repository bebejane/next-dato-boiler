import s from './page.module.scss';
import { AllPostsDocument, StartDocument } from '@/graphql';
import { Link } from '@/i18n/routing';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, Markdown } from 'next-dato-utils/components';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Content from '@/components/content/Content';

export const dynamic = 'force-static';

export default async function Home({ params }: PageProps<'/[locale]'>) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	setRequestLocale(locale);

	const { start, draftUrl } = await apiQuery(StartDocument, {
		variables: { locale: locale as SiteLocale },
	});

	const { allPosts, draftUrl: postsDraftUrl } = await apiQuery(AllPostsDocument, {
		variables: { locale: locale as SiteLocale },
		tags: ['color'],
	});

	if (!start) return notFound();

	return (
		<>
			<article className={s.article}>
				<h1>{start.headline}</h1>
				<Content content={start.content} />
				<ul>
					{allPosts
						.filter((post) => post.slug)
						.map((post, idx) => (
							<li key={idx}>
								<Link
									locale={locale}
									data-datocms-content-link-group
									href={{
										pathname: '/posts/[post]',
										params: { post: post.slug as string },
									}}
								>
									<div
										className={s.color}
										style={{ backgroundColor: post.background?.color?.hex }}
										data-datocms-content-link-url={post.color?._editingUrl}
									></div>{' '}
									<span>{post.title}</span>
								</Link>
							</li>
						))}
				</ul>
			</article>
			<DraftMode url={[draftUrl, postsDraftUrl]} path={`/${locale}`} />
		</>
	);
}

export async function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}
