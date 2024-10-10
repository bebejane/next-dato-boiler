import { NextApiRequest, NextApiResponse } from 'next';
import { withVercelCronAuth } from 'dato-nextjs-utils/hoc';

export const config = {
  runtime: 'nodejs'
}

export default withVercelCronAuth(async (req: NextApiRequest, res: NextApiResponse) => {

  return res.status(200).json({ message: 'Hello World' })

});