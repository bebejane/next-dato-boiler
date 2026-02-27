import s from './page.module.scss';
import { PostDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Markdown } from 'next-dato-utils/components';
import { Link, locales } from '@/i18n/routing';
import { Image } from 'react-datocms';
import Content from '@/components/content/Content';

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

	return (
		<>
			<article className={s.page} style={{ backgroundColor: post.color?.color?.hex }}>
				<h1>{post.title}</h1>
				<h3>Markdown</h3>
				<div data-datocms-content-link-group>
					<Markdown content={post.intro ?? ''} />
				</div>
				<h3>Structured</h3>
				<Content content={post.content} />
				<br />
				{post.image && <Image imgClassName={s.image} data={post.image.responsiveImage} />}
				<br />
				<Link href={`/`}>
					<button>Tillbaka</button>
				</Link>
			</article>
			<DraftMode url={draftUrl} path={`/${locale}/posts/${slug}`} />
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
