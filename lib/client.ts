'use server';

//@ts-ignore
import { DocumentNode } from 'graphql';
//@ts-ignore
import { print } from 'graphql';
import { cache } from 'react';

export type ApiQueryOptions = {
  variables?: Record<string, any>;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
  visualEditingBaseUrl?: string;
  revalidate?: number;
};

export async function apiQuery<T>(
  query: DocumentNode,
  options: ApiQueryOptions = {
    variables: {},
    includeDrafts: false,
    excludeInvalid: false,
    visualEditingBaseUrl: null,
    revalidate: null,
  }) {

  const {
    variables,
    includeDrafts,
    excludeInvalid,
    visualEditingBaseUrl,
    revalidate,
  } = options;

  const { data } = await dedupedFetch(
    JSON.stringify({ query: print(query), variables, revalidate }),
    includeDrafts,
    excludeInvalid,
    visualEditingBaseUrl,
    revalidate,
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
  ) => {

    const headers = {
      Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`,
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
    };

    const response = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers,
      body,
      next: { revalidate },
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

