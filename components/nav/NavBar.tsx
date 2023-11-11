'use server'

import Link from "next/link";
import s from './NavBar.module.scss'
import { apiQuery } from "@lib/client";
import { AllMenusDocument } from "@graphql";

export default async function NavBar({ }: {}) {

  const { allMenus } = await apiQuery<AllMenusQuery, AllMenusQueryVariables>(AllMenusDocument, { generateTags: true, revalidate: 5 });

  return (
    <ul className={s.navbar}>
      <li><Link href={'/'}>Home</Link></li>
      {allMenus.map(({ id, title, slug }) => (
        <li key={id}><Link href={`/test/menu/${slug}`}>{title}</Link></li>
      ))}
    </ul>
  );
}