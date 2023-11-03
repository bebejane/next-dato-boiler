'use server';

import type { DocumentNode } from 'graphql';
import { print } from 'graphql';
import { cache } from 'react';

export type ApiQueryOptions = {
  variables?: Record<string, any>;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
  visualEditingBaseUrl?: string | null;
  revalidate?: number | null;
  tags?: string[]
};

export async function apiQuery<T>(
  query: DocumentNode,
  options: ApiQueryOptions = {
    variables: {},
    includeDrafts: false,
    excludeInvalid: false,
    visualEditingBaseUrl: null,
    revalidate: null,
    tags: []
  }) {

  const {
    variables,
    includeDrafts,
    excludeInvalid,
    visualEditingBaseUrl,
    revalidate,
    tags
  } = options;

  const body = JSON.stringify({ query: print(query), variables }) as string
  const { data } = await dedupedFetch(
    body,
    includeDrafts,
    excludeInvalid,
    visualEditingBaseUrl,
    revalidate,
    tags
  );

  return data as T;
}

const dedupedFetch = cache(
  async (
    body,
    includeDrafts = false,
    excludeInvalid = false,
    visualEditingBaseUrl = null,
    revalidate = null,
    tags = []
  ) => {

    const headers = {
      'Authorization': `Bearer ${process.env.DATOCMS_API_TOKEN}`,
      ...(includeDrafts ? { 'X-Include-Drafts': 'true' } : {}),
      ...(excludeInvalid ? { 'X-Exclude-Invalid': 'true' } : {}),
      ...(visualEditingBaseUrl
        ? {
          'X-Visual-Editing': 'vercel-v1',
          'X-Base-Editing-Url': visualEditingBaseUrl,
        }
        : {}),
      ...(process.env.DATOCMS_ENVIRONMENT
        ? { 'X-Environment': process.env.DATOCMS_ENVIRONMENT }
        : {}),
    } as unknown as HeadersInit

    const next: { revalidate?: number, tags?: string[] } = {}

    if (revalidate !== null)
      next['revalidate'] = revalidate
    if (tags?.length > 0)
      next['tags'] = tags

    const response = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers,
      body,
      next,
    });

    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(
        `${response.status} ${response.statusText}: ${JSON.stringify(
          responseBody,
        )}`,
      );
    }

    return responseBody;
  },
);

