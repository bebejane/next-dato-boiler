import { betterAuth } from 'better-auth';
import { datoCmsAdapter } from '@/lib/auth/adapter/DatoCmsBetterAuthAdapter';

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: datoCmsAdapter({
		client: {
			apiToken: process.env.DATOCMS_API_TOKEN,
		},
		debugLogs: true,
		usePlural: false,
		modelPrefix: 'auth_',
	}),
});
