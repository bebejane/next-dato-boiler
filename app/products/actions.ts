'use server';

import { cookies } from "next/headers";

export async function setCurrency(data: FormData) {
  const code = data.get('code').toString()
  cookies().set('currency', code as string)

}