import { apiQuery } from "next-dato-utils";
import { AllPostsTestDocument } from "@graphql";

(async () => {
  const data = await apiQuery<AllPostsTestQuery, AllPostsTestQueryVariables>(AllPostsTestDocument);
  console.log(data)
})()