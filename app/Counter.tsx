'use client';
import s from './Counter.module.scss'
import { use } from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const sleep = (ms) => new Promise((resolve) => setTimeout(()=>resolve(ms), ms))

export default function Counter({title, date}) {
  
  //const ms = use(sleep(1000))
  const [count, setCount] = useState(0);
  const router = useRouter()
  
  return (
    <div className={s.counter}>
      <h2 >{title} {date.toString()}</h2>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={() => router.refresh()}>Refresh</button>
    </div>
  );
}
