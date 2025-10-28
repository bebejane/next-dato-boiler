import { apiQuery } from 'next-dato-utils/api';
import { AllPostsDocument } from '@/graphql';
import { DatoCmsConfig, getUploadReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';

export default {
	i18n: {
		locales: ['en', 'sv'],
		defaultLocale: 'en',
	},
	routes: {
		start: async (record, locale) => ['/'],
		post: async (record, locale) => [`/post/${record.slug[locale] ?? record.slug}`],
		upload: async (record, locale) => getUploadReferenceRoutes(record),
	},
	sitemap: async () => {
		const { allPosts } = await apiQuery(AllPostsDocument, { all: true });
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 1,
			},
		].concat(
			allPosts.map((post) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`,
				lastModified: new Date(post._updatedAt),
				changeFrequency: 'daily',
				priority: 0.8,
			}))
		) as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		return {
			name: 'next-dato-boiler',
			short_name: 'next-dato-boiler',
			description: 'next-dato-boiler description',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
				disallow: '/medlem/',
			},
		};
	},
} satisfies DatoCmsConfig;
