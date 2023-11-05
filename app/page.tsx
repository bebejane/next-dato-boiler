'use server'

import s from './page.module.scss'
import Link from "next/link"
import { apiQuery } from '@lib/client';
import { StartDocument } from '@graphql';
import { draftMode } from 'next/headers'
import { format } from 'date-fns';
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
import { DraftMode } from '@components';

export default async function Home() {

  const { start, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument, { includeDrafts: draftMode().isEnabled });

  return (
    <>
      <h1>{start.headline}</h1>
      <br />
      {start.posts.map(post => (
        <div className={s.post} key={post.id}>
          <Link href={`/posts/${post.slug}`}>
            <h3>
              {post.title}
            </h3>
          </Link>
          <div className={s.small}>
            {format(new Date(post.updatedAt), 'yyyy-MM-dd HH:mm')}
          </div>
          <Markdown>{post.content}</Markdown>
          <div className={s.small}>
            {post.author.name}
          </div>
        </div>
      ))}
      {start.posts.length === 0 && 'No posts yet...'}
      <DraftMode draftMode={draftMode().isEnabled} draftUrl={draftUrl} tag={start.id} />
    </>
  )
}