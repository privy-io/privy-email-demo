import { useState } from 'react'
import useSWR from 'swr'
import { EmailModal } from './EmailModal'

type GetUsersResponse = {
  users: {
    id: string
    groups: string[]
  }[]
}

const UserTable = (props: { token?: string }) => {
  // Active user id is the user id we are targeting
  const [activeUserId, setActiveUserId] = useState<string>('')

  // For tracking the email modal state
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  // We use the Next.js useSWR hook to poll for the live set of all users, but a
  // vanilla `fetch` would also work.
  const { data, error } = useSWR(
    props.token ? `${process.env.BASE_PATH}/api/users` : '',
    async (url: string) => {
      const res = await fetch(url, {
        headers: new Headers({
          access_token: props.token || '',
        }),
      })

      if (res.status >= 400) {
        throw new Error(await res.json())
      }

      return (await res.json()) as GetUsersResponse
    }
  )

  if (error) return <p>An error has occurred.</p>
  if (!data) return <p>Loading...</p>

  return (
    <section className="m-auto w-full max-w-7xl">
      <div className="m-auto mt-4 max-w-2xl rounded-lg bg-indigo-200 px-4 py-2 text-sm italic text-indigo-900">
        In this &quot;Admin&quot; view, you can see how you might email your
        users using only their on-chain addresses, each associated with a stored
        email. Find your address that you entered earlier on the landing page,
        and send yourself an email!
      </div>
      <h1 className="m-4 text-2xl font-medium">Email Center</h1>

      <table className="min-w-full table-fixed text-left text-sm shadow-sm">
        <thead className="border-b bg-gray-200">
          <tr className="font-bold">
            <th className="rounded-tl-lg px-6 py-4">User ID</th>
            <th className="rounded-tr-lg px-6 py-4 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => {
            return (
              <tr
                key={user.id}
                className="border-b bg-white transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="whitespace-nowrap px-6 py-4">{user.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button
                    className="btn btn-inline btn-secondary"
                    onClick={() => {
                      setActiveUserId(user.id)
                      toggleModal()
                    }}
                  >
                    Send Email
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {modalOpen ? (
        <EmailModal
          userIds={[activeUserId]}
          closeModal={toggleModal}
          token={props.token}
        />
      ) : null}
    </section>
  )
}

export default UserTable
