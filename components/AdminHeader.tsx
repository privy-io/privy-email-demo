import Link from 'next/link'

const Header = () => {
  return (
    <nav className="flex min-w-full items-center justify-between bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-4 text-white sm:px-8">
      <div className="flex-no-shrink mr-8 flex items-center">
        <div className="ml-4">
          <Link href="/">
            <a className="text-xl font-semibold tracking-tight">
              acme corp 🌸{' '}
              <span className="ml-2 text-xl font-normal tracking-tight">|</span>
              <span className="ml-2 text-xl font-normal tracking-tight">
                admin
              </span>
            </a>
          </Link>
        </div>
      </div>
      <Link href="/" passHref>
        <span className="w-1/2 cursor-pointer px-6 text-right leading-none text-barely-not-white sm:w-1/4">
          View Landing Page →
        </span>
      </Link>
    </nav>
  )
}

export default Header
