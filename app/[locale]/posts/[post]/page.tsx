import { AllPostsDocument, PostDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Markdown } from 'next-dato-utils/components';
import Content from '@/components/content/Content';
import { locales } from '@/i18n/routing';

export default async function Post({ params }) {
	const { locale, post: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();
	setRequestLocale(locale);

	const { post, draftUrl } = await apiQuery(PostDocument, {
		variables: {
			slug,
			locale: locale as SiteLocale,
		},
	});

	if (!post) return notFound();

	return (
		<>
			<article>
				<h1>{post.title}</h1>
				<Markdown content={post.intro} />
				<Content content={post.content} />
			</article>
			<DraftMode url={draftUrl} path={`/${locale}/${slug}`} />
		</>
	);
}

export async function generateStaticParams({ params }) {
	const { locale } = await params;
	if (!locales.includes(locale as any)) return notFound();
	const { allPosts } = await apiQuery(AllPostsDocument, {
		all: true,
		variables: {
			locale: locale as SiteLocale,
		},
	});
	return allPosts.map((post) => ({
		post: post.slug,
	}));
}
