'use server'

import s from './page.module.scss'
import Link from "next/link"
import { apiQuery } from '@lib/client';
import { StartDocument } from '@graphql';
import { draftMode } from 'next/headers'
import { format } from 'date-fns';
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
import DraftMode from '@lib/next-dato-utils/components/DraftMode';
import { Image } from 'react-datocms';

export default async function Home() {

  const { start, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument, {
    includeDrafts: draftMode().isEnabled,
    tags: ['start', 'post']
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