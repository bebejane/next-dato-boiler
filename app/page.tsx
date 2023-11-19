import s from './page.module.scss'
import Link from "next/link"
import { StartDocument } from '@graphql';
import { format } from 'date-fns';
import { apiQuery, Markdown, DraftMode } from 'next-dato-utils';
import { Image } from 'react-datocms';

export default async function Home() {

  const { start, draftUrl } = await apiQuery<StartQuery, StartQueryVariables>(StartDocument, {
    tags: ['start'],
    logs: true,
    generateTags: false
  });

  return (
    <>
      <h1>{start.headline}</h1>
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
              <figure>
                <Image data={post.image.responsiveImage} className={s.image} pictureClassName={s.picture} placeholderClassName={s.picture} />
                <figcaption>
                  {post.image.title}
                </figcaption>
              </figure>
            }
          </Link>
          <Markdown content={post.content} />
          <div className={s.small}>
            {post.author.name}
          </div>
        </div>
      ))}
      {start.posts.length === 0 && 'No posts yet...'}
      <DraftMode url={draftUrl} tag={start.id} />
    </>
  )
}