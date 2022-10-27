import { withRevalidate } from 'dato-nextjs-utils/hoc'

export default withRevalidate(async (record, revalidate) => {
  
  const { api_key: apiKey } = record.model;
  const { slug }  = record
  const paths = []

  if(slug) 
    paths.push(`/${slug}`)

  switch (apiKey) {
    case 'start':
      paths.push(`/`)
      break;
    default:
      break;
  }
  revalidate(paths)
})