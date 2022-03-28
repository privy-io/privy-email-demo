import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/AdminHeader'
import UserTable from '../components/UserTable'
import { useAuth } from '../hooks/user'

const Home: NextPage = () => {
  const { token } = useAuth()

  return (
    <div className="flex min-h-screen min-w-full flex-col items-center">
      <Head>
        <title>Acme Corp | Admin</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>"
        />
      </Head>

      <Header />
      <main className="flex w-full flex-col justify-center px-20">
        <UserTable token={token} />
      </main>
    </div>
  )
}

export default Home
