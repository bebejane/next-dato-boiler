import s from './page.module.scss'
import Link from "next/link"
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { Image } from 'react-datocms';

export default async function Home() {

  return (
    <>
      <div className={s.page}>
        <h1>Home</h1>
        <p>This is the home page</p>
      </div>
    </>
  )
}