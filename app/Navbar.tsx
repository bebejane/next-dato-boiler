//'use client'
import s from './Navbar.module.scss'
import { use } from 'react';
import { apiQuery } from '/lib/api';
import { AllPostsDocument } from '../lib/graphql';
import { sleep } from '/app/utils';
import Link from 'next/link';

const getData = async () => {
  const res =  await apiQuery(AllPostsDocument, {})
  return res
}
export default  async function Navbar() {
  
  console.log('load navbar');
  //use(sleep(2000))
  //await sleep(2000)
  const { posts } = await apiQuery(AllPostsDocument, {})
  
  return (
    <ul className={s.navbar}>
      {posts.map((p, key) => 
        <li key={key}>
          <Link href={p.slug}>{p.title}</Link>
        </li>
      )}
    </ul>
  );
}
