'use server'

import { AllMenusDocument } from "@graphql";
import { apiQuery } from "next-dato-utils";

export async function generateStaticParams() {
  const { allMenus } = await apiQuery<AllMenusQuery, AllMenusQueryVariables>(AllMenusDocument, { generateTags: true });
  return allMenus.map(({ slug }) => ({ params: { slug } }));
}

export default async function MenuPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Menu Page</h1>
      {params.slug}
    </div>
  );
}