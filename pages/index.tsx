import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { PrivyClient, SiweSession } from '@privy-io/privy-browser'
import Link from 'next/link'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any
  }
}
const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitEmail = async () => {
    if (!window?.ethereum || !window.ethereum.isMetaMask) {
      return
    }
    const provider = typeof window !== 'undefined' ? window.ethereum : null
    const session = new SiweSession(
      process.env.NEXT_PUBLIC_PRIVY_API_KEY || '',
      provider,
      {
        baseURL: process.env.NEXT_PUBLIC_PRIVY_API_URL,
      }
    )

    await session.authenticate()
    const address = (await session.address()) || ''

    if (!address) {
      console.log('failed to get session')
    }

    const privy = new PrivyClient({
      session: session,
      apiURL: process.env.NEXT_PUBLIC_PRIVY_API_URL || '',
      kmsURL: process.env.NEXT_PUBLIC_PRIVY_KMS_URL || '',
    })

    await privy.put(address, [
      {
        field: 'email',
        value: email,
      },
      {
        field: 'signup-topic',
        value: 'gardening',
      },
    ])
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen min-w-full flex-col items-center">
      <Head>
        <title>Acme Corp</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌸</text></svg>"
        />
      </Head>

      <main className="flex h-full w-full flex-col">
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 to-indigo-800 px-3 lg:px-6">
          <section className="mx-auto max-w-7xl">
            <nav className="flex h-24 w-full items-center">
              <div className="mx-auto flex h-24 w-full items-center justify-between font-medium">
                <span className="w-1/2 py-4 px-6 text-xl font-black leading-none text-barely-not-white sm:w-1/4">
                  acme corp 🌸
                </span>
                <div className="mt-12 flex h-full flex-col items-center justify-center text-center font-medium text-indigo-200 md:mt-0 md:flex-row md:items-center">
                  <a
                    href="#"
                    className="mx-2 py-2 text-barely-not-white lg:mx-3"
                  >
                    Home
                  </a>
                  <div className="mx-2 py-2 hover:text-barely-not-white lg:mx-3">
                    Features
                  </div>
                  <div className="mx-2 py-2 hover:text-barely-not-white lg:mx-3">
                    Blog
                  </div>
                </div>
                <Link href="/admin" passHref>
                  <span className="w-1/2 cursor-pointer py-4 px-6 text-right leading-none text-barely-not-white sm:w-1/4">
                    View Admin →
                  </span>
                </Link>
              </div>
            </nav>
            <div className="mx-auto text-center sm:px-4">
              <div className="m-auto mt-4 max-w-2xl rounded-lg bg-yellow-200 px-4 py-2 text-sm italic text-yellow-900">
                This demo shows off the Privy{' '}
                <a
                  href="https://docs.privy.io/guide/actions/sending-emails"
                  className="underline"
                >
                  send API
                </a>
                . Entering an email below will associate it with a wallet
                address. You can click on &quot;View Admin&quot; to see what it
                is like to send an email to that wallet directly, without ever
                seeing the email. Note that the wallet address used to sign up
                (but not the email) will be publicly visible to all users of
                this demo.
              </div>
              <h1 className="py-32 text-4xl font-extrabold leading-10 tracking-tight text-barely-not-white sm:text-5xl sm:leading-none md:text-6xl xl:text-7xl">
                <span className="block">Join the next evolution</span>{' '}
                <span className="relative mt-3 inline-block text-barely-not-white">
                  in web3 gardening.
                </span>
              </h1>
              <div className="mx-auto mt-6 max-w-lg text-center text-sm text-indigo-200 sm:text-base md:mt-12 md:max-w-xl md:text-lg xl:text-xl">
                Growing plants in web3 has never been easier.
              </div>
              {!submitted ? (
                <>
                  <div className="relative mx-auto mt-12 flex max-w-md items-center overflow-hidden rounded-full text-center">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email Address"
                      className="h-12 w-full px-6 py-2 font-medium text-indigo-800 focus:outline-none"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="relative top-0 right-0 block">
                      <button
                        type="button"
                        className="inline-flex h-12 w-32 items-center border border-transparent bg-indigo-400 px-8 text-base font-bold leading-6 text-barely-not-white transition duration-150 ease-in-out hover:bg-indigo-800 focus:outline-none active:bg-indigo-900"
                        onClick={submitEmail}
                      >
                        Sign Up
                      </button>
                    </span>
                  </div>
                  <div className="mt-4 text-sm italic text-indigo-300">
                    Protected by Privy
                  </div>
                </>
              ) : (
                <div className="mt-4 text-sm italic text-indigo-300">
                  Thanks for signing up!
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
