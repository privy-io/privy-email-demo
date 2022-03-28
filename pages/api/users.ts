import type { NextApiRequest, NextApiResponse } from 'next'
import { PRIVY_API_KEY, PRIVY_API_SECRET } from '../../config'
import { checkAuth, errorMiddleware } from '../../helpers/api_middleware'
import axios from 'axios'

type ResponseBody = {
  users: { id: string }[]
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  checkAuth(req)

  // We are using an old users endpoint while we work on rolling out a new one!
  const response = await axios.get(
    `${process.env.PRIVY_API_URL}/groups/default/users`,
    {
      auth: {
        username: PRIVY_API_KEY,
        password: PRIVY_API_SECRET,
      },
    }
  )

  const usersIds = response.data.user_ids as string[]
  const users = usersIds.map((userId) => ({
    id: userId,
  }))

  res.status(200).json({ users: users })
}

export default errorMiddleware(handler)
