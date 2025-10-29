import { apiQuery } from 'next-dato-utils/api';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';

export default {
	routes: {},
	sitemap: async () => {},
	manifest: async () => {},
	robots: async () => {},
} satisfies DatoCmsConfig;
