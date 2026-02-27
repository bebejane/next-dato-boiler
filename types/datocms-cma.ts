import type { ItemTypeDefinition } from '@datocms/cma-client';
type EnvironmentSettings = {
  locales: 'sv' | 'en';
};
export type Post = ItemTypeDefinition<
  EnvironmentSettings,
  '520129',
  {
    title: {
      type: 'string';
      localized: true;
    };
    color: {
      type: 'link';
    };
    intro: {
      type: 'text';
      localized: true;
    };
    content: {
      type: 'structured_text';
      blocks: LinkImage;
      localized: true;
    };
    image: {
      type: 'file';
    };
    slug: {
      type: 'slug';
      localized: true;
    };
    author: {
      type: 'link';
    };
  }
>;
export type Page = ItemTypeDefinition<
  EnvironmentSettings,
  '876485',
  {
    title: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
  }
>;
export type AuthUser = ItemTypeDefinition<
  EnvironmentSettings,
  'BmmC_204Q2q80pakRIUNhA',
  {
    name: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
    email_verified: {
      type: 'boolean';
    };
    image: {
      type: 'file';
    };
    accounts: {
      type: 'links';
    };
    sessions: {
      type: 'links';
    };
    user_verification_tokens: {
      type: 'links';
    };
  }
>;
export type AuthAccount = ItemTypeDefinition<
  EnvironmentSettings,
  'CANE8qJyT8OmtkreQWhLng',
  {
    account_id: {
      type: 'string';
    };
    provider_id: {
      type: 'string';
    };
    user_id: {
      type: 'link';
    };
    access_token: {
      type: 'string';
    };
    refresh_token: {
      type: 'string';
    };
    id_token: {
      type: 'string';
    };
    access_token_expires_at: {
      type: 'date_time';
    };
    refresh_token_expires_at: {
      type: 'date_time';
    };
    scope: {
      type: 'string';
    };
    password: {
      type: 'string';
    };
  }
>;
export type Start = ItemTypeDefinition<
  EnvironmentSettings,
  'EDSrTw81QlK2PiluP8Fnsw',
  {
    headline: {
      type: 'string';
      localized: true;
    };
    intro: {
      type: 'text';
    };
    posts: {
      type: 'links';
    };
  }
>;
export type Author = ItemTypeDefinition<
  EnvironmentSettings,
  'OVWjZwVwQZmaCAyjO1P20w',
  {
    name: {
      type: 'string';
    };
  }
>;
export type LinkImage = ItemTypeDefinition<
  EnvironmentSettings,
  'OsBAsjykQKGEZclBbIeMxA',
  {
    name: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
  }
>;
export type Color = ItemTypeDefinition<
  EnvironmentSettings,
  'SvgIE1bUSaiQEmf-iBbczQ',
  {
    label: {
      type: 'string';
    };
    color: {
      type: 'color';
    };
  }
>;
export type AuthVerification = ItemTypeDefinition<
  EnvironmentSettings,
  'VDNPpHABRT6-EHrYrfQeQQ',
  {
    identifier: {
      type: 'string';
    };
    value: {
      type: 'string';
    };
  }
>;
export type AuthSession = ItemTypeDefinition<
  EnvironmentSettings,
  'ddvS6N7lSsao3H2Rw9FJwQ',
  {
    expires_at: {
      type: 'date_time';
    };
    token: {
      type: 'string';
    };
    user_agent: {
      type: 'string';
    };
    ip_address: {
      type: 'string';
    };
    user_id: {
      type: 'link';
    };
  }
>;
export type AnyBlock = Page | LinkImage;
export type AnyModel =
  | Post
  | AuthUser
  | AuthAccount
  | Start
  | Author
  | Color
  | AuthVerification
  | AuthSession;
export type AnyBlockOrModel = AnyBlock | AnyModel;
