/**
 * This is a mostly-idempotent script to set up your Privy instance with the
 * necessary configuration for the demo to run. This is an alternative to having
 * to manually configure this yourself!
 * 
 * Note that if you change aspects of the configuration outside of the script
 * (i.e. remove a role from the access group through the console UI), you may
 * run into issues, as we only check to make sure each item has been created,
 * but not that the full contents are identical to our desired state.
 */

import dotenv from 'dotenv'
import { PrivyClient } from '@privy-io/privy-node'

// Next.js has smooth hooks for loading `.env.local`, but since we're running
// this script outside of the framework, we use dotenv to load the env vars
dotenv.config({ path: '.env.local' })

// Initialize our node client
const privy = new PrivyClient(process.env.PRIVY_API_KEY, process.env.PRIVY_API_SECRET, {
  apiURL: process.env.PRIVY_API_URL,
  kmsURL: process.env.PRIVY_KMS_URL,
})

// 1. Create the access group if it does not exist
const accessGroups = await privy.listAccessGroups()
let accessGroup = accessGroups.find((ag) => ag.name === 'Garden App Data')
if (!accessGroup) {
  console.log('Creating access group...')
  accessGroup = await privy.createAccessGroup({
    name: 'Garden App Data',
    description: 'Default access group for accessing garden data',
    read_roles: ['self', 'admin'],
    write_roles: ['self'],
  })
  console.log(`Access group ${accessGroup.access_group_id} created!`)
} else {
  console.log('Skipping access group creation - access group found')
}

// 2. Create the email and name fields if they do not exist. Fields that have
// not been created will throw a PrivyApiError from the returned 404.
const fields = [
  { id: 'email', description: "User's email address" },
  { id: 'signup-topic', description: "The topic that got the user to complete the sign-up flow" }
]

for (const field of fields) {
  try {
    await privy.getField(field.id)
    console.log(`Skipping ${field.id} field creation - field found`)
  } catch (e) {
    if (e.status !== 404) throw e

    console.log(`Creating field ${field.id}...`)
    await privy.createField({
      name: field.id,
      description: field.description,
      default_access_group: accessGroup.access_group_id,
    })
    console.log(`Field ${field.id} created!`)
  }
}
