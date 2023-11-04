'use server'

import s from './page.module.scss'
import { notFound } from 'next/navigation';
import { apiQuery } from '@lib/client';
import { AllPostsDocument, PostDocument } from '@graphql';
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
import { draftMode } from 'next/headers'
import BackgroundColor from '@app/posts/BackgroundColor';

export async function generateStaticParams() {
  const { posts } = await apiQuery<AllPostsQuery>(AllPostsDocument, { generateTags: false });

  return posts.map((post) => ({
    post: post.slug,
  }))
}

export default async function Post({ params }: { params: { post: string, id: string } }) {

  const { post } = await apiQuery<PostQuery>(PostDocument, {
    variables: { slug: params.post },
    includeDrafts: draftMode().isEnabled
  });

  if (!post)
    return notFound();

  return (
    <>
      <div className={s.container}>
        <h1>{post.title}</h1>
        <Markdown>{post.content}</Markdown>
        <p>
          {post.author.name}
        </p>
      </div>
      <BackgroundColor color={post.background?.hex} />
    </>
  )
}