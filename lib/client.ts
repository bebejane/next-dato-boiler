'use server';

import type { DocumentNode } from 'graphql';
import { print } from 'graphql';
import { cache } from 'react';
import deepIterator from 'deep-iterator';

export type ApiQueryOptions = {
  variables?: Record<string, any>;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
  visualEditingBaseUrl?: string | null;
  revalidate?: number | null;
  tags?: string[]
};

const defaultApiQueryOptions: ApiQueryOptions = {
  variables: {},
  includeDrafts: false,
  excludeInvalid: false,
  visualEditingBaseUrl: null,
  revalidate: null,
  tags: []
};

export async function apiQuery<T>(query: DocumentNode, options: ApiQueryOptions = defaultApiQueryOptions) {

  const dedupeOptions = {
    body: JSON.stringify({ query: print(query), variables: options.variables }) as string,
    includeDrafts: options.includeDrafts,
    excludeInvalid: options.excludeInvalid,
    visualEditingBaseUrl: options.visualEditingBaseUrl,
    revalidate: options.revalidate,
    tags: options.tags
  }

  const res = await dedupedFetch(dedupeOptions);

  const { data } = await dedupedFetch({
    ...dedupeOptions,
    tags: generateIdTags(res, options.tags)
  });

  return data as T;
}

type DedupeOptions = {
  body: string;
  includeDrafts: boolean;
  excludeInvalid: boolean;
  visualEditingBaseUrl: string | null;
  revalidate?: number | null;
  tags?: string[]
}

const defaultDedupeOptions: DedupeOptions = {
  body: '',
  includeDrafts: false,
  excludeInvalid: false,
  visualEditingBaseUrl: null,
  revalidate: null,
  tags: []
}

const dedupedFetch = cache(
  async (options: DedupeOptions = defaultDedupeOptions) => {
    const {
      body,
      includeDrafts,
      excludeInvalid,
      visualEditingBaseUrl,
      revalidate,
      tags
    } = options;

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

const generateIdTags = (data: any, tags: string[]): string[] => {
  const allTags: string[] = []
  for (let { key, value } of deepIterator(data))
    key === 'id' && allTags.push(value)
  allTags.push.apply(allTags, tags)
  return allTags

}