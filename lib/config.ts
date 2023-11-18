import { ConfigDocument } from "@graphql";
import { apiQuery } from "next-dato-utils";

export default async function getConfig(): Promise<ConfigQuery['config']> {
  return (await apiQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, {
    tags: ['config']
  })).config;
}