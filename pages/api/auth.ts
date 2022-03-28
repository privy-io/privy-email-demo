import type { NextApiRequest, NextApiResponse } from 'next'
import { FAKE_ACCESS_TOKEN } from '../../config'
import { errorMiddleware } from '../../helpers/api_middleware'

type ResponseBody = {
  token: string
  user: {
    id: string
  }
}

// This pretends to be a simple auth + identity endpoint for the sake
// of demonstration. Your users should authenticate with your auth system
// and then you need to validate this when they start requesting privileged
// Privy data.
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  // Return back a fake token for use in subsequent privileged calls
  res.status(200).json({
    token: FAKE_ACCESS_TOKEN,
    user: {
      id: req.body.user_id,
    },
  })
}

export default errorMiddleware(handler)
