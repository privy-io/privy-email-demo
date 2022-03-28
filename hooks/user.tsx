import { FAKE_ACCESS_TOKEN } from '../config'

// Mock useAuth flow. Not very secure ;)
export function useAuth() {
  return {
    token: FAKE_ACCESS_TOKEN,
    user: { id: 'admin' },
  }
}
