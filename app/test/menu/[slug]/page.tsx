import { AllMenusDocument } from "@graphql";
import { apiQuery } from "@lib/client";

export async function generateStaticParams() {
  const { allMenus } = await apiQuery<AllMenusQuery, AllMenusQueryVariables>(AllMenusDocument, { generateTags: true });
  return allMenus.map(({ slug }) => ({ params: { slug } }));
}

export default function MenuPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Menu Page</h1>
      {params.slug}
    </div>
  );
}