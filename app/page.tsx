'use server'

import s from './page.module.scss'
import Link from "next/link"
import { apiQuery } from '@lib/client';
import { AllPostsDocument } from '@graphql';
import { draftMode } from 'next/headers'

export default async function Home() {

  const { posts } = await apiQuery<AllPostsQuery>(AllPostsDocument, { revalidate: 5, includeDrafts: draftMode().isEnabled });

  return (
    <div className={s.container}>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>
              {post.title} {post.updatedAt} {post.author.name}
            </Link>
          </li>
        ))}
      </ul>
      {posts.length === 0 && 'No posts yet...'}
    </div>
  )
}