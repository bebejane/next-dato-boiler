
import { sleep } from "next-dato-utils";

export default async function ServerTest() {

  await sleep(3000);

  return <div>
    <h1>Done</h1>
  </div>


}