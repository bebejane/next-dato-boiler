import {
	AdapterAccount,
	AdapterAuthenticator,
	AdapterSession,
	AdapterUser,
	VerificationToken,
	AdapterAccountType,
	type Adapter,
} from '@auth/core/adapters';
import {
	User as DatoCmsUserType,
	UserSession as DatoCmsUserSessionType,
	UserAccount as DatoCmsUserAccountType,
	UserVerificationToken as DatoCmsUserVerificationTokenType,
} from '@/types/datocms-cma';

import { buildClient, DateTimeFieldValue } from '@datocms/cma-client';
import { Item } from '@datocms/cma-client/dist/types/generated/ApiTypes';

const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN as string,
});

type DatoCmsUser = Item<DatoCmsUserType>;
type DatoCmsUserSession = Item<DatoCmsUserSessionType>;
type DatoCmsUserAccount = Item<DatoCmsUserAccountType>;
type DatoCmsUserVerificationToken = Item<DatoCmsUserVerificationTokenType>;

export type DatoCmsAdapterConfig = {
	userItemTypeId: string;
	userModelApiKey: string;
	sessionItemTypeId: string;
	sessionModelApiKey: string;
	userAccountItemTypeId: string;
	userAccountModelApiKey: string;
	verificationTokenItemTypeId: string;
	verificationTokenModelApiKey: string;
};

const defaultConfig: DatoCmsAdapterConfig = {
	userItemTypeId: 'BmmC_204Q2q80pakRIUNhA/items',
	userModelApiKey: 'user',
	sessionItemTypeId: 'ddvS6N7lSsao3H2Rw9FJwQ',
	sessionModelApiKey: 'session',
	userAccountItemTypeId: 'CANE8qJyT8OmtkreQWhLng',
	userAccountModelApiKey: 'user_account',
	verificationTokenItemTypeId: 'VDNPpHABRT6-EHrYrfQeQQ',
	verificationTokenModelApiKey: 'verification_token',
};

// 2. A function that returns an object. Official adapters use this pattern.
export function DatoCmsAdapter(config: DatoCmsAdapterConfig = defaultConfig): Adapter {
	return {
		createUser: async (user: AdapterUser): Promise<AdapterUser> => {
			const newUser = await client.items.create<DatoCmsUserType>({
				item_type: {
					id: config.userItemTypeId as DatoCmsUserType['itemTypeId'],
					type: 'item_type',
				},
				user_id: user.id,
				email: user.email,
				name: user.name,
				email_verified: user.emailVerified
					? (new Date(user.emailVerified).toISOString() as DateTimeFieldValue)
					: undefined,
			});

			return datoCmsUserToAdapterUser(newUser);
		},
		/**
		 * Returns a user from the database via the user id.
		 *
		 * See also [User management](https://authjs.dev/guides/creating-a-database-adapter#user-management)
		 */

		getUser: async (id: string): Promise<AdapterUser | null> => {
			const user = await client.items.list<DatoCmsUserType>({
				filter: {
					type: 'user',
					fields: {
						user_id: {
							eq: id,
						},
					},
				},
			});

			return datoCmsUserToAdapterUser(user[0]);
		},
		/**
		 * Returns a user from the database via the user's email address.
		 *
		 * See also [Verification tokens](https://authjs.dev/guides/creating-a-database-adapter#verification-tokens)
		 */
		getUserByEmail: async (email: string): Promise<AdapterUser | null> => {
			const user = await client.items.list<DatoCmsUserType>({
				filter: {
					type: 'user',
					fields: {
						email: {
							eq: email,
						},
					},
				},
			});

			if (user.length === 0) return null;

			return datoCmsUserToAdapterUser(user[0]);
		},
		/**
		 * Using the provider id and the id of the user for a specific account, get the user.
		 *
		 * See also [User management](https://authjs.dev/guides/creating-a-database-adapter#user-management)
		 */
		getUserByAccount: async (
			providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>
		): Promise<AdapterUser | null> => {
			const user = await client.items.list<DatoCmsUserType>({
				filter: {
					type: 'user',
					fields: {
						user_id: {
							eq: providerAccountId.providerAccountId,
						},
					},
				},
			});

			return datoCmsUserToAdapterUser(user[0]);
		},
		/**
		 * Updates a user in the database and returns it.
		 *
		 * See also [User management](https://authjs.dev/guides/creating-a-database-adapter#user-management)
		 */
		updateUser: async (user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser> => {
			const u = await getDatoCmsUserFromAdapterUserId(user.id, config);

			if (!u) throw new Error('User not found');

			const updatedUser = await client.items.update<DatoCmsUserType>(u.id, {
				email: user.email,
				name: user.name,
				email_verified: user.emailVerified
					? (new Date(user.emailVerified).toISOString() as DateTimeFieldValue)
					: undefined,
			});

			return datoCmsUserToAdapterUser(updatedUser);
		},
		/**
		 * @todo This method is currently not invoked yet.
		 *
		 * See also [User management](https://authjs.dev/guides/creating-a-database-adapter#user-management)
		 */
		deleteUser: async (userId: string): Promise<AdapterUser | null | undefined> => {
			const u = await getDatoCmsUserFromAdapterUserId(userId, config);
			if (!u) throw new Error('User not found');

			await client.items.destroy(u.id);
			return;
		},
		/**
		 * This method is invoked internally (but optionally can be used for manual linking).
		 * It creates an [Account](https://authjs.dev/reference/core/adapters#models) in the database.
		 *
		 * See also [User management](https://authjs.dev/guides/creating-a-database-adapter#user-management)
		 */
		linkAccount: async (account: AdapterAccount): Promise<void> => {
			const user = await getDatoCmsUserFromAdapterUserId(account.userId, config);
			if (!user) throw new Error('User not found');

			const newAccount = await client.items.create<DatoCmsUserAccountType>({
				item_type: {
					id: config.userAccountItemTypeId as DatoCmsUserAccountType['itemTypeId'],
					type: 'item_type',
				},
				user_id: user.id,
				provider: account.provider,
				provider_account_id: account.providerAccountId,
			});

			return;
		},
		/** @todo This method is currently not invoked yet. */
		unlinkAccount: async (
			providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>
		): Promise<AdapterAccount | undefined> => {
			return;
		},
		/**
		 * Creates a session for the user and returns it.
		 *
		 * See also [Database Session management](https://authjs.dev/guides/creating-a-database-adapter#database-session-management)
		 */
		createSession: async (session: {
			sessionToken: string;
			userId: string;
			expires: Date;
		}): Promise<AdapterSession> => {
			const user = await getDatoCmsUserFromAdapterUserId(session.userId, config);
			if (!user) throw new Error('User not found');

			const expires = new Date();
			expires.setDate(expires.getDate() + 365);

			const newSession = await client.items.create<DatoCmsUserSessionType>({
				item_type: {
					id: config.sessionItemTypeId as DatoCmsUserSessionType['itemTypeId'],
					type: 'item_type',
				},
				user_id: session.userId,
				timestamp: expires.getTime(),
				session_token: session.sessionToken,
			});

			await client.items.update<DatoCmsUserType>(user.id, {
				sessions: [...user.sessions, newSession.id],
			});

			return datoCmsUserSessionToAdapterSession(newSession);
		},
		/**
		 * Returns a session and a userfrom the database in one go.
		 *
		 * :::tip
		 * If the database supports joins, it's recommended to reduce the number of database queries.
		 * :::
		 *
		 * See also [Database Session management](https://authjs.dev/guides/creating-a-database-adapter#database-session-management)
		 */
		getSessionAndUser: async (sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> => {
			const session = (
				await client.items.list<DatoCmsUserSessionType>({
					filter: {
						type: config.sessionModelApiKey,
						fields: {
							session_token: {
								eq: sessionToken,
							},
						},
					},
					limit: 1,
				})
			)[0];

			if (!session) return null;

			const user = (
				await client.items.list<DatoCmsUserType>({
					limit: 1,
					filter: {
						type: config.userModelApiKey,
						fields: {
							user_id: {
								eq: session.user_id as string,
							},
						},
					},
				})
			)[0];

			if (!session) return null;

			return {
				session: datoCmsUserSessionToAdapterSession(session),
				user: datoCmsUserToAdapterUser(user),
			};
		},
		/**
		 * Updates a session in the database and returns it.
		 *
		 * See also [Database Session management](https://authjs.dev/guides/creating-a-database-adapter#database-session-management)
		 */
		updateSession: async (
			session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
		): Promise<AdapterSession | null | undefined> => {
			const oldSession = (
				await client.items.list<DatoCmsUserSessionType>({
					limit: 1,
					filter: {
						type: config.sessionModelApiKey,
						fields: {
							session_token: {
								eq: session.sessionToken,
							},
							user_id: {
								eq: session.userId,
							},
						},
					},
				})
			)[0];

			if (!oldSession) return null;

			const timestamp = new Date();
			timestamp.setDate(timestamp.getDate() + 365);

			const updatedSession = await client.items.update<DatoCmsUserSessionType>(oldSession.id as string, {
				session_token: session.sessionToken,
				timestamp: timestamp.getTime(),
			});

			return datoCmsUserSessionToAdapterSession(updatedSession);
		},
		/**
		 * Deletes a session from the database. It is preferred that this method also
		 * returns the session that is being deleted for logging purposes.
		 *
		 * See also [Database Session management](https://authjs.dev/guides/creating-a-database-adapter#database-session-management)
		 */
		deleteSession: async (sessionToken: string): Promise<AdapterSession | null | undefined> => {
			const session = (
				await client.items.list<DatoCmsUserSessionType>({
					limit: 1,
					filter: {
						type: config.sessionModelApiKey,
						fields: {
							session_token: {
								eq: sessionToken,
							},
						},
					},
				})
			)[0];

			if (!session) return null;

			const user = await getDatoCmsUserFromAdapterUserId(session.user_id as string, config);

			if (!user) throw new Error('User not found');

			await client.items.update<DatoCmsUserType>(user.id, {
				sessions: user.sessions.filter((id) => id !== session.id),
			});
			await client.items.destroy(session.id as string);
			return datoCmsUserSessionToAdapterSession(session);
		},
		/**
		 * Creates a verification token and returns it.
		 *
		 * See also [Verification tokens](https://authjs.dev/guides/creating-a-database-adapter#verification-tokens)
		 */
		createVerificationToken: async (
			verificationToken: VerificationToken
		): Promise<VerificationToken | null | undefined> => {
			console.log('createVerificationToken', verificationToken);
			return null;
		},
		/**
		 * Return verification token from the database and deletes it
		 * so it can only be used once.
		 *
		 * See also [Verification tokens](https://authjs.dev/guides/creating-a-database-adapter#verification-tokens)
		 */
		useVerificationToken: async (params: { identifier: string; token: string }): Promise<VerificationToken | null> => {
			const verificationToken = (
				await client.items.list<DatoCmsUserVerificationTokenType>({
					filter: {
						type: config.verificationTokenModelApiKey,
						fields: {
							identifier: {
								eq: params.identifier,
							},
							token: {
								eq: params.token,
							},
						},
					},
					limit: 1,
				})
			)[0];

			if (!verificationToken) return null;

			await client.items.destroy(verificationToken.id);

			return datoCmsUserVerificationTokenToAdapterVerificationToken(verificationToken);
		},
		/**
		 * Get account by provider account id and provider.
		 *
		 * If an account is not found, the adapter must return `null`.
		 */
		getAccount: async (
			providerAccountId: AdapterAccount['providerAccountId'],
			provider: AdapterAccount['provider']
		): Promise<AdapterAccount | null> => {
			const account = (
				await client.items.list<DatoCmsUserAccountType>({
					filter: {
						type: config.userAccountModelApiKey,
						fields: {
							provider_account_id: {
								eq: providerAccountId,
							},
							provider: {
								eq: provider,
							},
						},
					},
					limit: 1,
				})
			)[0];
			if (!account) return null;

			return datoCmsUserAccountToAdapterAccount(account);
		},
		/**
		 * Returns an authenticator from its credentialID.
		 *
		 * If an authenticator is not found, the adapter must return `null`.
		 */
		getAuthenticator: async (
			credentialID: AdapterAuthenticator['credentialID']
		): Promise<AdapterAuthenticator | null> => {
			return null;
		},
		/**
		 * Create a new authenticator.
		 *
		 * If the creation fails, the adapter must throw an error.
		 */
		createAuthenticator: async (authenticator: AdapterAuthenticator): Promise<AdapterAuthenticator> => {
			console.log('createAuthenticator', authenticator);
			throw new Error('Method not implemented.');
			//return null;
		},
		/**
		 * Returns all authenticators from a user.
		 *
		 * If a user is not found, the adapter should still return an empty array.
		 * If the retrieval fails for some other reason, the adapter must throw an error.
		 */
		listAuthenticatorsByUserId: async (userId: AdapterAuthenticator['userId']): Promise<AdapterAuthenticator[]> => {
			console.log('listAuthenticatorsByUserId', userId);
			throw new Error('Method not implemented.');

			//return null;
		},
		/**
		 * Updates an authenticator's counter.
		 *
		 * If the update fails, the adapter must throw an error.
		 */
		updateAuthenticatorCounter: async (
			credentialID: AdapterAuthenticator['credentialID'],
			newCounter: AdapterAuthenticator['counter']
		): Promise<AdapterAuthenticator> => {
			console.log('updateAuthenticatorCounter', credentialID, newCounter);
			throw new Error('Method not implemented.');
			//return null;
		},
	};
}

async function getDatoCmsUserFromAdapterUserId(
	id: AdapterUser['id'],
	config: DatoCmsAdapterConfig
): Promise<DatoCmsUser | null> {
	const user = await client.items.list<DatoCmsUserType>({
		filter: {
			type: config.userModelApiKey,
			limit: 1,
			fields: {
				user_id: {
					eq: id,
				},
			},
		},
	});

	return user.length === 1 ? (user[0] as DatoCmsUser) : null;
}

function datoCmsUserToAdapterUser(user: DatoCmsUser): AdapterUser {
	return {
		id: user.user_id,
		email: user.email,
		name: user.name,
		emailVerified: user.email_verified ?? null,
	} as AdapterUser;
}

function datoCmsUserSessionToAdapterSession(session: DatoCmsUserSession): AdapterSession {
	return {
		id: session.id,
		sessionToken: session.session_token,
		userId: session.user_id,
		expires: new Date(session.timestamp as number),
	} as AdapterSession;
}

function datoCmsUserAccountToAdapterAccount(account: DatoCmsUserAccount): AdapterAccount {
	return {
		id: account.account_id,
		userId: account.user_id,
		provider: account.provider,
		providerAccountId: account.provider_account_id,
		accessToken: account.access_token,
		refreshToken: account.refresh_token,
		expires: account.expires_at ? new Date(account.expires_at as number) : null,
		tokenType: account.token_type,
		scope: account.scope,
		idToken: account.id_token,
		sessionState: account.session_state,
		type: account.account_type,
	} as AdapterAccount;
}

function datoCmsUserVerificationTokenToAdapterVerificationToken(
	token: DatoCmsUserVerificationToken
): VerificationToken {
	return {
		identifier: token.identifier,
		token: token.token,
		expires: new Date(token.timestamp as number),
	} as VerificationToken;
}
