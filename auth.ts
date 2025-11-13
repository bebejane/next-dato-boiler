import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { user, account, session, verification } from '@/db/schema';
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
	/*
	database: drizzleAdapter(db, {
		schema: {
			users: user,
			accounts: account,
			sessions: session,
			verifications: verification,
		},
		provider: 'sqlite',
		usePlural: true,
	}),
	*/
});
