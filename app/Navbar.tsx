//'use client'
import s from './Navbar.module.scss'
import { use } from 'react';
import { apiQuery } from 'dato-nextjs-utils/api';
import { AllPostsDocument } from '/lib/graphql';
import { sleep } from '/app/utils';
import Link from 'next/link';

export default  async function Navbar() {
  
  console.log('load navbar');
  const { posts } = await apiQuery(AllPostsDocument, {})
  
  return (
    <>
    <ul className={s.navbar}>
      <li>
        <Link href={'/'}>Hem</Link>
      </li>
      {posts.map((p, key) => 
        <li key={key}>
          <Link href={p.slug}>{p.title}</Link>
        </li>
      )}
    </ul>
    
    </>
  );
}
