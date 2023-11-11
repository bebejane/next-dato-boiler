'use server'

import type { DocumentNode } from 'graphql';
import { print } from 'graphql';
import { cache } from 'react';
import deepIterator from 'deep-iterator';

export type ApiQueryOptions<V> = {
  variables?: V;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
  visualEditingBaseUrl?: string | null;
  revalidate?: number | null;
  tags?: string[],
  generateTags?: boolean
};

const defaultApiQueryOptions = {
  includeDrafts: false,
  excludeInvalid: false,
  visualEditingBaseUrl: null,
  revalidate: parseInt(process.env.REVALIDATE_TIME),
  tags: [],
  generateTags: true
};

export async function apiQuery<T, V>(query: DocumentNode, options: ApiQueryOptions<V>): Promise<T & { draftUrl: string | null }> {

  options = { ...defaultApiQueryOptions, ...options }

  const queryId = (query.definitions?.[0] as any).name?.value as string
  const dedupeOptions: DedupeOptions = {
    body: JSON.stringify({ query: print(query), variables: options.variables }) as string,
    includeDrafts: options.includeDrafts,
    excludeInvalid: options.excludeInvalid,
    visualEditingBaseUrl: options.visualEditingBaseUrl,
    revalidate: options.includeDrafts ? 0 : options.revalidate,
    tags: options.tags,
    queryId
  }

  const tags = options.generateTags ? await generateIdTags(await dedupedFetch(dedupeOptions), options.tags, queryId) : options.tags
  const res = options.includeDrafts ? await dedupedFetch({ ...dedupeOptions, url: 'https://graphql-listen.datocms.com/preview' }) : {}
  const { data } = await dedupedFetch({ ...dedupeOptions, tags });

  return { ...data, draftUrl: res.url ?? null }
}

export type DedupeOptions = {
  url?: string
  body: string;
  includeDrafts: boolean;
  excludeInvalid: boolean;
  visualEditingBaseUrl: string | null;
  revalidate?: number | null;
  tags?: string[]
  queryId: string
}

const dedupedFetch = cache(async (options: DedupeOptions) => {
  const {
    url,
    body,
    includeDrafts,
    excludeInvalid,
    visualEditingBaseUrl,
    revalidate,
    tags,
    queryId
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

  const response = await fetch(url ?? 'https://graphql.datocms.com/', {
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
})

export const generateIdTags = (data: any, tags: string[] | null, queryId: string): string[] => {

  const allTags: string[] = []

  for (let { key, value } of deepIterator(data))
    key === 'id' && allTags.push(value)

  tags?.length && allTags.push.apply(allTags, tags)
  const idTags = allTags.filter((value, index, self) => self.indexOf(value) === index) // dedupe
  console.log('idTags', queryId, idTags)
  return idTags

}