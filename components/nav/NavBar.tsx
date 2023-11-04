'use server'

import Link from "next/link";
import s from './NavBar.module.scss'

export default async function NavBar({ }: {}) {
  return (
    <ul className={s.navbar}>
      <li><Link href={'/'}>Home</Link></li>
    </ul>
  );
}