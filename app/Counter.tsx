'use client'
import s from './Counter.module.scss'
import { use } from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DatoMarkdown } from 'dato-nextjs-utils/components';

const sleep = (ms) => new Promise((resolve) => setTimeout(()=>resolve(ms), ms))

const getData = async () => {
  return 'yo'
}

export default function Counter({title, date}) {
  
  //const ms = use(sleep(1000))
  //console.log(ms);
  
  const [count, setCount] = useState(0);
  const router = useRouter()
  
  
  return (
    <div >
      <h2 className={s.counter}>{title} {date?.toString()}</h2>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={() => router.refresh()}>Refresh</button>
      <DatoMarkdown>hej</DatoMarkdown>
    </div>
  );
}
