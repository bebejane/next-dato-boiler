'use server'

import { AllPostsTestDocument } from "@graphql";
import { apiQuery } from "next-dato-utils";

export default async function TestPage() {
  const { allPosts, allCurrencies } = await apiQuery<AllPostsTestQuery, AllPostsTestQueryVariables>(AllPostsTestDocument, {
    all: true,
    variables: {
      first: 100,
      skip: 0
    }
  });

  return (
    <div>
      <h1>Test Page</h1>
      <ul>
        {allPosts.map((post) => (<li key={post.id}>{post.title}</li>))}
      </ul>
      <div>{allPosts.length}</div>
      <ul>
        {allCurrencies.map((post) => (<li key={post.id}>{post.id}</li>))}
      </ul>
      <div>{allCurrencies.length}</div>
    </div>
  );
}