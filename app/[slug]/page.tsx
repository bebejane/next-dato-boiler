import { apiQuery } from '/lib/api';
import DatoMarkdown from '/lib/components/DatoMarkdown';
import { AllPostsDocument, PostDocument } from '../../lib/graphql';
import { usePathname } from 'next/navigation';
import { sleep } from '/app/utils';
import { NextPage } from 'next';

export default async function Page({params: { slug }}) {
  
  const { post } : { post: PostRecord} = await apiQuery(PostDocument, {variables:{slug}})

  return (
    <div>
      <h1>{post.title}</h1>
      <DatoMarkdown>{post.content}</DatoMarkdown>
    </div>
    )
}

export async function generateStaticParams() {
  const { posts } = await apiQuery(AllPostsDocument, {});

  return posts.map((post) => ({
    slug: post.slug,
  }));
}


