'use server'

import s from './page.module.scss'
import { notFound } from 'next/navigation';
import { AllPostsDocument, PostDocument } from '@graphql';
import { Markdown, DraftMode, apiQuery } from 'next-dato-utils';
import { draftMode } from 'next/headers'
import BackgroundColor from './BackgroundColor';

export async function generateStaticParams() {
  const { allPosts } = await apiQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, { tags: ['post'] });

  return allPosts.map((post) => ({
    post: post.slug,
  }))
}

export default async function Post({ params }: { params: { post: string, id: string } }) {

  const { post, draftUrl } = await apiQuery<PostQuery, PostQueryVariables>(PostDocument, { variables: { slug: params.post } });

  if (!post)
    return notFound();

  return (
    <>
      <div className={s.container}>
        <h1>{post.title}</h1>
        <Markdown content={post.content} />
        <p>
          {post.author.name}
        </p>
      </div>
      <BackgroundColor color={post.background?.hex} />
      <DraftMode url={draftUrl} tag={post.id} />
    </>
  )
}