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

  // We're in the process of figuring out the best way to pull the list of users
  // for your account. In the meantime, you can request this data by calling the
  // endpoint directly!
  const response = await axios.get(`${process.env.PRIVY_API_URL}/users/ids`, {
    auth: {
      username: PRIVY_API_KEY,
      password: PRIVY_API_SECRET,
    },
  })

  const usersIds = response.data.data as string[]
  const users = usersIds.map((userId) => ({
    id: userId,
  }))

  res.status(200).json({ users: users })
}

export default errorMiddleware(handler)
