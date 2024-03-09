import Link from "next/link";
import s from './NavBar.module.scss'
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { AllMenusDocument } from "@graphql";

export default async function NavBar({ }: {}) {

  const { allMenus, draftUrl } = await apiQuery<AllMenusQuery, AllMenusQueryVariables>(AllMenusDocument, {
    tags: ['menu']
  });

  return (
    <>
      <ul className={s.navbar}>
        <li><Link href={'/'} prefetch={false}>Home</Link></li>
        <li><Link href={'/posts/page/1'} prefetch={false}>Posts</Link></li>
        {allMenus.map(({ id, title, slug }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
      <DraftMode url={draftUrl} tag={'menu'} />
    </>
  );
}