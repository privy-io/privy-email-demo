import type { NextApiRequest, NextApiResponse } from 'next'
import {
  PRIVY_API_URL,
  PRIVY_API_KEY,
  PRIVY_API_SECRET,
  PRIVY_KMS_URL,
} from '../../config'
import { PrivyClient } from '@privy-io/privy-node'
import { errorMiddleware, checkAuth } from '../../helpers/api_middleware'

type SendEmailPayload = {
  userId: string
  subject: string
  htmlContent: string
  fields: string | string[]
}

type ResponseBody = {
  sent: true
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  checkAuth(req)

  const privy = new PrivyClient(PRIVY_API_KEY, PRIVY_API_SECRET, {
    apiURL: PRIVY_API_URL,
    kmsURL: PRIVY_KMS_URL,
  })
  const body = req.body as SendEmailPayload
  // Due to the sensitive nature of email sends, we have a switch to disable
  // sends for cases such as our public-facing demo.
  if (process.env.SEND_ENABLED) {
    await privy.sendEmail(
      body.userId,
      `[Privy Send Demo] ${body.subject}`,
      body.htmlContent,
      body.fields
    )
  }
  res.status(200).json({ sent: true })
}

export default errorMiddleware(handler)
