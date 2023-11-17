'use server'

import s from './page.module.scss'
import { apiQuery, DraftMode } from 'next-dato-utils'
import { AllPostsDocument, ConfigDocument } from '@graphql'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const getConfig = async (): Promise<ConfigQuery['config']> => {
  return (await apiQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, {
    tags: ['config']
  })).config;
}

export default async function PostsPage({ params: { page } }) {

  const { pageSize } = await getConfig();
  const { allPosts, _allPostsMeta: { count }, draftUrl } = await apiQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, {
    variables: {
      first: pageSize,
      skip: (page - 1) * pageSize,
    },
    tags: ['post']
  });

  if (!allPosts.length)
    return notFound();

  return (
    <>
      <div className={s.container}>
        {allPosts.map(post =>
          <div key={post.id}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </div>
        )}

        <ul className={s.pagination}>
          {Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => (
            <li key={i} className={(i + 1) == page ? s.active : undefined}>
              <Link href={`/posts/page/${i + 1}`}>{i + 1}</Link>
            </li>
          ))}
        </ul>
      </div>
      <DraftMode url={draftUrl} path="/" />
    </>
  )
}

export async function generateStaticParams() {
  const { pageSize } = await getConfig();
  const { allPosts } = await apiQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, {
    all: true,
    tags: ['post']
  });

  const pages = Math.ceil(allPosts.length / pageSize);

  return Array.from({ length: pages }, (_, i) => ({
    params: {
      page: (i + 1)
    }
  }))
}