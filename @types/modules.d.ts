declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const value: DocumentNode;
  export = schema;
}

declare module 'markdown-truncate' {
  function truncateMarkdown(string, {limit:number, ellipsis:booelan}): string;
  export = truncateMarkdown;
}