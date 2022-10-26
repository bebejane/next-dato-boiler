import type { NextApiRequest, NextApiResponse } from "next"

export default async function withPreview(req : NextApiRequest, res : NextApiResponse) {

  if ( req.query.secret !== process.env.DATOCMS_PREVIEW_SECRET || !req.query.slug)
    return res.status(401).json({ message: 'Invalid token' })
  
  const { slug } = req.query

  try {
    res.setPreviewData({}, {maxAge: 10})
    res.writeHead(307, { Location: slug ? slug : `/` })
    res.end()
  }catch(err){
    console.error(err)
    return res.status(401).json({ message: 'Error previewing page!' })
  }
}