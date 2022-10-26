'use client';
import s from './Counter.module.scss'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DateComp from './DateComp'

export default function Counter({title, date}) {
  const [count, setCount] = useState(0);
  const router = useRouter()
  
  return (
    <div className={s.counter}>
      <h2 >{title} {date.toString()}</h2>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={() => router.refresh()}>Refresh</button>
      <DateComp date={date.toString()} onClick={()=>console.log('hej')}/>
    </div>
  );
}
