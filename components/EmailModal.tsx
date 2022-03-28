import React, { useState } from 'react'

export const EmailModal = (props: {
  userIds: string[]
  token?: string
  closeModal: () => void
}) => {
  // User input tracking
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  // Email send state tracking
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [isSending, setIsSending] = useState(false)

  if (!props.userIds.length) return <></>

  /* This function actually calls our example send endpoint (located at /pages/api/send-email.ts),
   * which then makes the call to the Privy send API. We include our mock auth token to simulate
   * your admin user's auth.
   */
  const sendEmail = async () => {
    setIsSending(true)
    try {
      for (const userId of props.userIds) {
        const res = await fetch(`${process.env.BASE_PATH}/api/send-email`, {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            access_token: props.token || '',
          }),
          body: JSON.stringify({
            userId: userId,
            subject: subject,
            htmlContent: message,
            // Here we blindly fetch "signup-topic", even though it might not be
            // needed for the email template. We recommend being explicit about the
            // data needed, as that information is forwarded to an email provider.
            fields: ['signup-topic'],
          }),
        })
        if (!res.ok) {
          console.error(res.status, await res.json())
          throw new Error('Failed to send')
        }
      }

      // This is all niceties to close the modal after a successful send or failure
      setIsSending(false)
      setSuccess(true)
      setTimeout(close, 1000)
    } catch (e) {
      setIsSending(false)
      setError(true)
    }
  }

  const close = () => {
    setError(false)
    setIsSending(false)
    setSuccess(false)
    props.closeModal()
  }

  return (
    <>
      <div
        className="absolute top-0 right-0 bottom-0 left-0 z-10 bg-gray-700 py-12 opacity-50 transition duration-150 ease-in-out"
        id="modal-backdrop"
      ></div>
      <div
        className="absolute top-0 right-0 bottom-0 left-0 z-10 py-12 transition duration-150 ease-in-out"
        id="modal"
      >
        <div className="container mx-auto w-full">
          <div className="relative rounded-xl border border-gray-400 bg-white py-8 px-5 shadow-md md:px-10">
            <h1 className="mb-4 text-2xl font-medium">New Message</h1>
            <div>
              <div>
                <label
                  htmlFor="audience"
                  className="text-sm font-bold leading-tight"
                >
                  AUDIENCE
                </label>
                <div className="mt-2">
                  {props.userIds.map((id) => (
                    <span key={id} className="mr-1 rounded bg-indigo-100 p-1">
                      {id.length > 8
                        ? `${id.slice(0, 5)}...${id.slice(-3)}`
                        : id}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="subject"
                  className="text-sm font-bold leading-tight"
                >
                  SUBJECT
                </label>
                <input
                  id="subject"
                  className="mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-indigo-700 focus:outline-none"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="message"
                  className="text-sm font-bold leading-tight"
                >
                  MESSAGE
                </label>
                <p>
                  <span
                    className="mr-1 cursor-pointer rounded bg-emerald-100 p-1 text-xs"
                    onClick={() => {
                      setSubject('🌸 $GARDEN prices are on the rise')
                      setMessage(`<p>Nice to meet you!</p>
{{#if signup-topic}}
  <p>We heard you liked {{signup-topic}}. Let's get you into the weeds so that you can take advantage of those rising $GARDEN prices.</p>
{{else}}
  <p>Let's get you started! Fill out our <u>interest survey</u> to help us understand more about how $GARDEN prices might be relevant to you.</p>
{{/if}}`)
                    }}
                  >
                    Welcome
                  </span>
                  <span
                    className="mr-1 cursor-pointer rounded bg-emerald-100 p-1 text-xs"
                    onClick={() => {
                      setSubject(
                        "😱 Heads up! You're about to run out of $GARDEN tokens"
                      )
                      setMessage(`<h3>Oh no!</h3>
<p>Your garden may wither if you don't update your $GARDEN token holdings. We recommend you log in to our portal and update your garden tokens to avoid any issues.</p>`)
                    }}
                  >
                    $GARDEN Alert
                  </span>
                </p>
                <textarea
                  id="message"
                  className="mt-2 flex h-48 w-full items-center rounded border border-gray-300 p-3 font-mono text-sm font-normal text-gray-600 focus:border focus:border-indigo-700 focus:outline-none"
                  placeholder="<p>Hello!</p>..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-lg bg-rose-500 px-4 py-2 italic text-white">
                An error occurred while sending.
              </div>
            ) : null}
            {success ? (
              <div className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 italic text-white">
                {props.userIds.length} email
                {props.userIds.length == 1 ? '' : 's'} sent!
              </div>
            ) : null}

            <div className="mt-8 flex w-full items-center justify-end">
              <button
                className="btn btn-secondary"
                onClick={close}
                disabled={success || error || isSending}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary ml-3"
                onClick={sendEmail}
                disabled={
                  success ||
                  error ||
                  isSending ||
                  subject.length == 0 ||
                  message.length == 0
                }
              >
                Submit
              </button>
            </div>
            <button
              className="absolute top-0 right-0 mt-4 mr-5 cursor-pointer rounded text-gray-400 transition duration-150 ease-in-out hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
              onClick={close}
              aria-label="close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
