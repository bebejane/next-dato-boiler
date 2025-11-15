import { AllPostsDocument, PostDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Markdown } from 'next-dato-utils/components';
import Content from '@/components/content/Content';
import { Link, locales } from '@/i18n/routing';

export const dynamicParams = true;

export default async function Post({ params }: PageProps<'/[locale]/posts/[post]'>) {
	const { locale, post: slug } = await params;
	if (!locales.includes(locale as any)) return notFound();
	setRequestLocale(locale);

	const { post, draftUrl } = await apiQuery(PostDocument, {
		variables: {
			slug,
			locale: locale as SiteLocale,
		},
		tags: ['color'],
	});

	if (!post) return notFound();
	console.log('render post:', slug, locale);
	return (
		<>
			<article style={{ backgroundColor: post.color?.color?.hex }}>
				<h1>{post.title}</h1>
				<Markdown content={post.intro ?? ''} />
				<Content content={post.content} />
				<br />
				<Link href={`/`}>
					<button>Tillbaka</button>
				</Link>
			</article>
			<DraftMode url={draftUrl} path={`/posts/${slug}`} />
		</>
	);
}
/*

export async function generateStaticParams({ params }: PageProps<'/[locale]/posts/[post]'>) {
	const { locale } = await params;
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
*/
