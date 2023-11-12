'use server'

import s from './page.module.scss'
import { apiQuery, DraftMode } from 'next-dato-utils';
import { AllPostsDocument } from '@graphql';
import { draftMode } from 'next/headers'
import Link from 'next/link';

export default async function Posts() {

  const { allPosts, draftUrl } = await apiQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, {
    generateTags: false,
    tags: ['post']
  });

  return (
    <>
      <div className={s.container}>
        <h1>All posts</h1>
        <ul>
          {allPosts.map(post => (
            <li key={post.id}>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <DraftMode enabled={draftMode().isEnabled} draftUrl={draftUrl} path="/posts" />
    </>
  )
}