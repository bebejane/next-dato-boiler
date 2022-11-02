import { apiQuery } from 'dato-nextjs-utils/api';
import { AllPostsDocument } from '../lib/graphql';
import Counter from '/app/Counter';
import { DatoMarkdown } from 'dato-nextjs-utils/components';
import { sleep } from "/app/utils";

export default async function Page() {
  
  console.log('page load');
  const { posts } = await apiQuery(AllPostsDocument, {})
  
  return (
    <>
      <h1>Hola</h1>
      <Counter date={new Date()} title={'counter'} />
      <DatoMarkdown>
        Markdonw text is here
        here her
        er
      </DatoMarkdown>
    </>
  );
}