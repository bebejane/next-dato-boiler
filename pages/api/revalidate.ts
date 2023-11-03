import { withRevalidate } from 'dato-nextjs-utils/hoc';

export default withRevalidate(async (record, revalidate) => {

  const { api_key } = record.model;
  const { slug } = record
  const paths = []

  switch (api_key) {
    case 'post':
      paths.push(`/posts/${slug}`)
      paths.push(`/`)
      break;
    default:
      break;
  }

  revalidate(paths)
})