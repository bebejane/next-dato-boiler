import Counter from "./Counter";


export default function Page() {
  console.log('page load');
  const date = new Date()

  return (
    <>
      <h1>Hola</h1>
      <Counter title={'hej'} date={date.toString()}/>
      
    </>
  );
}