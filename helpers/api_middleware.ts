import { NextApiRequest, NextApiResponse } from 'next'
import { FAKE_ACCESS_TOKEN } from '../config'

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export const checkAuth = (req: NextApiRequest) => {
  console.log(
    `[${req.method} ${req.url}]`,
    'Token match:',
    req.headers.access_token == FAKE_ACCESS_TOKEN
  )
  if (req.headers.access_token != FAKE_ACCESS_TOKEN) {
    throw new UnauthorizedError('Request requires a valid access token')
  }
  return true
}

export const errorHandler = (err: Error, res: NextApiResponse) => {
  if (err.name === 'UnauthorizedError') {
    console.error(err)
    return res.status(401).json({ message: err.message })
  }

  console.error(err)
  return res.status(500).json({ message: err.message })
}

export const errorMiddleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (err) {
      errorHandler(err as Error, res)
    }
  }
}
