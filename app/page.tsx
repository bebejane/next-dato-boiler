'use server'

import s from './page.module.scss'
import Link from "next/link"
import { StartDocument } from '@graphql';
import { draftMode } from 'next/headers'
import { format } from 'date-fns';
import { Markdown, apiQuery } from 'next-dato-utils';
import DraftMode from '@lib/draft/DraftMode';

import { Image } from 'react-datocms';

export default async function Home() {

  const { start, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument, {
    includeDrafts: draftMode().isEnabled,
    tags: ['start']
  });

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
            <div className={s.small}>
              {format(new Date(post.updatedAt), 'yyyy-MM-dd HH:mm')}
            </div>
            {post.image &&
              <Image data={post.image.responsiveImage} className={s.image} pictureClassName={s.picture} placeholderClassName={s.picture} />
            }
          </Link>
          <Markdown content={post.content} />
          <div className={s.small}>
            {post.author.name}
          </div>
        </div>
      ))}
      {start.posts.length === 0 && 'No posts yet...'}
      <DraftMode enabled={draftMode().isEnabled} draftUrl={draftUrl} tag={start.id} />
    </>
  )
}