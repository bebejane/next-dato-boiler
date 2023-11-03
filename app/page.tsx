'use server'

import s from './page.module.scss'
import Link from "next/link"
import { apiQuery } from '@lib/client';
import { AllPostsDocument, StartDocument } from '@graphql';
import { draftMode } from 'next/headers'

export default async function Home() {

  const { start } = await apiQuery<StartQuery>(StartDocument, { includeDrafts: draftMode().isEnabled });
  const { posts } = await apiQuery<AllPostsQuery>(AllPostsDocument, { includeDrafts: draftMode().isEnabled });

  return (
    <div className={s.container}>
      <h1>{start.headline}</h1>
      <br />
      <b>Posts</b>
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