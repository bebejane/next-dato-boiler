import { apiQuery } from "next-dato-utils/api";
import { AllPostsTestDocument } from "@graphql";

(async () => {
  const data = await apiQuery<AllPostsTestQuery, AllPostsTestQueryVariables>(AllPostsTestDocument);
  console.log(data)
})()