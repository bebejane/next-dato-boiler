import Counter from "./Counter";
import { apiQuery } from '/lib/api';
import { AllPostsDocument } from '../lib/graphql';
import { sleep } from "/app/utils";

export default async function Page() {
  
  const date = new Date()
  console.log('page load');
  const { posts } = await apiQuery(AllPostsDocument, {})
  //const ms = await sleep(5000)
  console.log(posts.length);
  
  return (
    <>
      <h1>Hola</h1>
      <Counter title={'hej'} date={date.toString()}/>
    </>
  );
}